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
import { CRDT } from '../../../../../utils/wrappers/CRDT'
import { Patch } from 'immer'

type UPageRawChange =
  | { t: 'change'; id: str; data: UBlockData; addPreview?: bool }
  | { t: 'change-type'; id: str; type: UBlockType; data: UBlockData }
  | { t: 'insert'; ublocks: UBlocks }
  | { t: 'delete'; ids: strs }
  | { t: 'trigger-flag'; name: keyof UPageFlags; type: 'unset' | 'set' }
export type UPageRawChanges = UPageRawChange[]

export type UPageChange = { changes: UPageRawChanges; preview: ChangePreview; blockId?: str }

export class UPageStateCR {
  #updatesSigner: UpdatesSigner
  #cr: CRDT
  #tree: UPageShallowTree
  #deleteUPageChanges: DeleteUpdates

  constructor(id: str, updates: Bytes[], sendUpdate: SendUpdate, deleteUpdates: DeleteUpdates) {
    this.#updatesSigner = new UpdatesSigner(id)
    this.#cr = new CRDT(
      updates,
      (doc) => doc.getMap(ROOT),
      (update, rawUpdate) => {
        const description = this.#updatesSigner.sign(rawUpdate)
        sendUpdate(id, update, description)
      },
      (updatesLeft, deletedShas) => {
        this.#tree = this.#getTree()
        this.#deleteUPageChanges(id, updatesLeft, deletedShas)
      },
    )
    this.#tree = this.#getTree()

    this.#deleteUPageChanges = deleteUpdates
  }

  get state(): UPageData {
    return this.#tree.data
  }

  applyUpdate = (updates: Bytes[]): UPageData | undefined => {
    if (this.#cr.applyUpdate(updates)) return this.state
  }

  // use for Idea related data only
  _applyPatch = (preview: ChangePreview, patches: Patch[] | Patch) => {
    if (!Array.isArray(patches)) patches = [patches]
    if (!patches.length) return
    this.#updatesSigner.prepare(preview)
    this.#cr.change(patches)
  }

  change = ({ changes, preview, blockId }: UPageChange) => {
    if (!changes.length) return

    this.#cr.change(() => {
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

        this.#updatesSigner.prepare(preview, blockId)
      })
    })
  }

  append = (ublocks: UBlocks) => {
    this.#cr.change(() => {
      this.#tree.append(ublocks)
      this.#updatesSigner.prepare(previewMaker.bold('Appended', getNewBlocksPreview(ublocks)))
    })
  }

  undo = (): UPageData => {
    this.#updatesSigner.prepare(previewMaker.bold('Undo'))
    this.#cr.undo()
    return this.state
  }

  redo = (): UPageData => {
    this.#updatesSigner.prepare(previewMaker.bold('Redo'))
    this.#cr.redo()
    return this.state
  }

  rollBackTo = (sha: str): UPageData => {
    this.#cr.rollBackTo(sha)
    return this.state
  }

  #getTree = (): UPageShallowTree => {
    return new UPageShallowTree(this.#cr.getRootRef<UPageCRData>(), (d, t) => {
      const block = new Y.Map() as UBlockCR
      block.set('data', new Y.Text(d))
      block.set('type', new Y.Text(t))
      return block
    })
  }
}

class UpdatesSigner {
  #upageId: str
  #preview: ChangePreview = []
  #blockId?: str

  constructor(upageId: str) {
    this.#upageId = upageId
  }

  prepare = (preview: ChangePreview, blockId?: str) => {
    this.#preview = preview
    this.#blockId = blockId
  }

  sign = (update: Uint8Array): UPageChangeDescriptionDTO => {
    const r = signUpdate(this.#upageId, update, this.#preview, this.#blockId)
    this.prepare([])
    return r
  }
}

function signUpdate(
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
type UPageCRData = UPageFlags & { ublocks: UBlockMap }
type UPageCR = YObject<UPageCRData>
const r = (y: Y.Doc): UPageCR => y.getMap(ROOT) as UPageCR

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
