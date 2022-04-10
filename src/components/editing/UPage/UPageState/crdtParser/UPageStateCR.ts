import * as Y from 'yjs'
import { Bytes } from 'firebase/firestore'
import { UBlockData, UBlocks, UBlockType, UPageData, UPageFlags } from '../../ublockTypes'
import { bool, f, str, strs } from '../../../../../utils/types'
import { YObject } from './types'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { safe } from '../../../../../utils/utils'
import { getSha } from '../../../../../utils/wrappers/shaUtils'
import { DUMMY_DATA, UPageShallowTree } from './UPageShallowTree'
import { getUserId } from '../../userId'
import { now } from '../../../../../utils/wrappers/timeUtils'
import { getNewBlocksPreview, previewMaker } from './previewGeneration'
import { ChangePreview, UPageChangeDescriptionDTO, UPageChangeDescriptionDTOs } from '../../../../../fb/FSSchema'

type UPageRawChange =
  | { t: 'change'; id: str; data: UBlockData; addPreview?: bool }
  | { t: 'change-type'; id: str; type: UBlockType; data: UBlockData }
  | { t: 'insert'; ublocks: UBlocks }
  | { t: 'delete'; ids: strs }
  | { t: 'trigger-flag'; name: keyof UPageFlags; type: 'unset' | 'set' }
export type UPageRawChanges = UPageRawChange[]

export type UPageChange = { changes: UPageRawChanges; preview: ChangePreview; blockId?: str }

export class UPageStateCR {
  #id: str
  #undoManager: Y.UndoManager
  #doc: Y.Doc
  #sendUpdate: SendUpdate
  #tree: UPageShallowTree
  #updates: Uint8Array[]
  #deleteUPageChanges: DeleteUpdates
  #lastUpdate?: Bytes

  constructor(id: str, updates: Bytes[], sendUpdate: SendUpdate, deleteUpdates: DeleteUpdates) {
    this.#id = id
    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    this.#doc = ydocFromArrays(this.#updates)
    this.#undoManager = new Y.UndoManager(r(this.#doc), { captureTimeout: 0 })
    this.#tree = this.#getTree()

    this.#sendUpdate = sendUpdate
    this.#deleteUPageChanges = deleteUpdates
    this.#lastUpdate = safe(updates.at(-1))
  }

  get state(): UPageData {
    return this.#tree.data
  }

  applyUpdate = (updates: Bytes[]): UPageData | undefined => {
    if (updates.length === this.#updates.length && this.#lastUpdate && updates.at(-1)?.isEqual(this.#lastUpdate)) return

    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    const update = Y.mergeUpdatesV2(u8a)
    Y.applyUpdateV2(this.#doc, update) // updates are idempotent -> applying existing updates is fine
    // this.#tree // all doc references are valid after updates merge (tested on Y.Text)
    return this.state
  }

  change = ({ changes, preview, blockId }: UPageChange) => {
    if (!changes.length) return
    // TODO: test memory occupation
    return this.#change(
      preview,
      () => {
        this.#doc.transact(() => {
          changes.forEach((change) => {
            switch (change.t) {
              case 'insert':
                this.#tree.insert(change.ublocks)
                break
              case 'delete':
                this.#tree.delete(change.ids)
                break
              case 'change':
                change.addPreview
                  ? preview.push(...this.#tree.change(change.id, change.data))
                  : this.#tree.change(change.id, change.data)
                break
              case 'change-type':
                this.#tree.changeType(change.id, change.type, change.data)
                break
              case 'trigger-flag':
                this.#tree.triggerFlag(change.name, change.type)
                break
            }
          })
        })
      },
      blockId,
    )
  }

  append = (ublocks: UBlocks) =>
    this.#change(previewMaker.bold('Appended', getNewBlocksPreview(ublocks)), () => this.#tree.append(ublocks))

  undo = (): UPageData => this.#changeState(previewMaker.bold('Undo'), () => this.#undoManager.undo())
  redo = (): UPageData => this.#changeState(previewMaker.bold('Redo'), () => this.#undoManager.redo())

  rollBackTo = (sha: str): UPageData => {
    const shas = [] as strs

    for (let i = this.#updates.length - 1; i > -1; i--) {
      const updateSha = getSha(this.#updates[i])

      if (updateSha === sha) {
        // probably a better way
        // const updatesToDelete = this.#updates.slice(i + 1).map((u) => Bytes.fromUint8Array(u))
        this.#updates = this.#updates.slice(0, i + 1)

        this.#doc = ydocFromArrays(this.#updates)
        this.#undoManager = new Y.UndoManager(r(this.#doc), { captureTimeout: 0 })
        this.#tree = this.#getTree()

        this.#deleteUPageChanges(
          this.#id,
          this.#updates.map((u) => Bytes.fromUint8Array(u)),
          shas,
        )
      }

      shas.push(updateSha)
    }

    return this.state
  }

  #changeState = (preview: ChangePreview, changeFn: () => void, blockId?: str): UPageData => {
    this.#change(preview, changeFn, blockId)
    return this.state
  }

  #change = (preview: ChangePreview, changeFn: () => void, blockId?: str) => {
    let update: Uint8Array | undefined

    this.#doc.once('updateV2', (u: Uint8Array) => {
      update = u
    })

    changeFn()

    if (update) {
      const description = signUpdate(this.#id, update, preview, blockId)
      const bytes = Bytes.fromUint8Array(update)
      this.#sendUpdate(this.#id, bytes, description)
      this.#updates.push(update)
      this.#lastUpdate = bytes
    }
  }

  #getTree = (): UPageShallowTree => {
    return new UPageShallowTree(r(this.#doc), (d, t) => {
      const block = new Y.Map() as UBlockCR
      block.set('data', new Y.Text(d))
      block.set('type', new Y.Text(t))
      return block
    })
  }
}

export function signUpdate(
  upageId: str,
  update: Uint8Array,
  preview: ChangePreview,
  blockId?: str,
): UPageChangeDescriptionDTO {
  return {
    upageId,
    sha: getSha(update),
    block: blockId || undefined,
    date: now(),
    preview,
    user: getUserId(),
  }
}

type Updates = { update: Bytes; description: UPageChangeDescriptionDTO }[]
export function mergeUpdates(id: str, updates: Updates, sendUpdate: SendUpdate) {
  const update = Y.mergeUpdatesV2(updates.map(({ update }) => update.toUint8Array()))
  const preview = updates.map((update) => update.description.preview).flat()
  const description = signUpdate(id, update, preview)
  sendUpdate(id, Bytes.fromUint8Array(update), description)
}

export function getInitialUPageState(): Bytes[] {
  const doc = new Y.Doc()

  doc.transact(() => {
    const page = r(doc)
    const ublocks = new Y.Map()

    const rootCR = new Y.Map() as UBlockCR
    const rootJS = { ublocks: [DUMMY_DATA] }
    rootCR.set('data', new Y.Text(JSON.stringify(rootJS)))
    rootCR.set('type', new Y.Text())

    ublocks.set('r', rootCR)
    page.set('ublocks', ublocks)
  })

  const bytes = Y.encodeStateAsUpdateV2(doc)

  return [Bytes.fromUint8Array(bytes)]
}

export const getInitialIdeaState = getInitialUPageState

export type SendUpdate = (id: str, update: Bytes, description: UPageChangeDescriptionDTO) => void
export type DeleteUpdates = (id: str, _updatesLeft: Bytes[], _shas: strs) => void

const ROOT = 'root'

type UBlockCR = YObject<{ type: str; data: Y.Text }>
type UBlockMap = Y.Map<UBlockCR>
type UPageCR = YObject<UPageFlags & { ublocks: UBlockMap }>

const r = (y: Y.Doc): UPageCR => y.getMap(ROOT) as UPageCR

const bytesToU8A = (bytes: Bytes[]) => bytes.map((v) => v.toUint8Array())

function ydocFromArrays(arrays: Uint8Array[]): Y.Doc {
  const doc = new Y.Doc()
  const update = Y.mergeUpdatesV2(arrays)
  Y.applyUpdateV2(doc, update)
  return doc
}

export const _stateToBase64 = (state: { doc: Y.Doc }): str => _docToBase64(state.doc)
const _docToBase64 = (doc: Y.Doc): str => fromUint8Array(Y.encodeStateAsUpdateV2(doc))
export const _base64ToState = (base64: str): Bytes[] => [Bytes.fromUint8Array(toUint8Array(base64))]

export const _mockServer = (initialUpdates: Bytes[]) => {
  const descriptions = [] as UPageChangeDescriptionDTOs
  const updates = [] as Bytes[]
  const deletedUpdates = [] as Bytes[]
  const deletedShas = [] as strs
  return {
    updates,
    descriptions,
    deletedUpdates,
    deletedShas,
    sendUpdate: (_id: str, u: Bytes, d: UPageChangeDescriptionDTO) => {
      updates.push(u)
      descriptions.push(d)
    },
    deleteUPageChanges: (_id: str, u: Bytes[], shas: strs) => {
      deletedUpdates.push(...u)
      deletedShas.push(...shas)
    },
    getInitialUpdates: () => initialUpdates,
  }
}

type TestBlock = [str, str?, UBlockType?]
type TestBlocks = Array<TestBlock | str>

export const _printStates = (name = 'empty', ...namesAndStates: [str, TestBlocks][]) => {
  if (name !== 'empty')
    return console.info(`const ${name} = \`${_buildState(safe(namesAndStates.find(([n]) => n === name))[1])}\``)
  namesAndStates.unshift([name, []])

  const states = [] as strs
  namesAndStates.forEach(([name, state]) => {
    states.push(`const ${name} = \`${_buildState(state)}\``)
  })

  console.info(states.join('\n'))
}

const _buildState = (blocks: TestBlocks = []): str => {
  blocks = blocks.map((b) => {
    if (!Array.isArray(b)) return [b]
    return b
  })

  const createBlock = (t: str, d: str) => {
    const block = new Y.Map() as UBlockCR
    block.set('data', new Y.Text(d))
    block.set('type', new Y.Text(t))
    return block
  }

  const doc = new Y.Doc()

  const page = r(doc)
  const ublocks = new Y.Map()

  const rootCR = new Y.Map() as UBlockCR
  const rootJS = { ublocks: [DUMMY_DATA] }
  blocks.forEach((block) => {
    const [id, data, type = 'text'] = block as TestBlock
    if (id.startsWith('-')) ublocks.set(id.slice(1), createBlock(type, data || id.slice(1)))
    else {
      rootJS.ublocks.push(id)
      ublocks.set(id, createBlock(type, data || id))
    }
  })

  rootCR.set('data', new Y.Text(JSON.stringify(rootJS)))
  rootCR.set('type', new Y.Text())

  ublocks.set('r', rootCR)
  page.set('ublocks', ublocks)

  return _docToBase64(doc)
}

export function _getUPSCR(updates: Bytes[], sendUpdate: SendUpdate = f, deleteChanges: DeleteUpdates = f) {
  return new UPageStateCR('id', updates, sendUpdate, deleteChanges)
}
