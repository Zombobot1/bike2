import * as Y from 'yjs'
import { Bytes } from 'firebase/firestore'
import { UBlock, UBlockData, UBlockTypes, UPageData } from '../types'
import { Fn, JSObject, num, str } from '../../../../utils/types'
import { YMap } from './types'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { applyStrChanges, getStrChanges } from '../changesGeneration/getStrChange'
import { isStr, safe } from '../../../../utils/utils'
import { applyObjectChanges, ObjectChange, ObjectChanges } from '../changesGeneration/getFlatObjectChanges'
import { sha256, sha224 } from 'js-sha256'
import { CPath, describeChanges, UPageChange, UPageChanges } from './upageChanges'
import { UndoManager, ydocFromBytes } from './undoManager'
import { sendUPageUpdate, UPageChangeDescriptionDTO } from '../../../../fb/upageChangesAPI'
import { getSha } from '../../../../utils/wrappers/shaUtils'
import { Patch } from 'immer'

const ROOT = 'root'
const UBLOCKS = 'ublocks'

const ID = 'id'
const TYPE = 'type'
const DATA = 'data'

export function getInitialUPageState(color: str): Bytes[] {
  const doc = new Y.Doc()

  const root = doc.getMap(ROOT)
  root.set('name', new Y.Text())
  root.set('color', new Y.Text(color))
  root.set('ublocks', new Y.Array())

  const bytes = Y.encodeStateAsUpdateV2(doc)
  return [Bytes.fromUint8Array(bytes)]
}

export interface UPageStateCRDT {
  doc: Y.Doc
  state: UPageData
  _undoManager: { undo: Fn; redo: Fn }
}

export class CRDTParser {
  #undoManager: UndoManager
  #doc: Y.Doc
  #sendUpdate: (update: Bytes, description?: UPageChangeDescriptionDTO) => void

  constructor(updates: Bytes[], sendUpdate = sendUPageUpdate) {
    this.#undoManager = new UndoManager(updates.map((u) => u.toUint8Array()))
    this.#doc = ydocFromBytes(updates)
    this.#sendUpdate = sendUpdate
  }

  get state(): UPageData {
    return docToState(this.#doc)
  }

  applyUpdateFromServer = (updates: Bytes[]): UPageData => {
    const updatesU8A = updates.map((v) => v.toUint8Array())
    const update = Y.mergeUpdatesV2(updatesU8A)
    Y.applyUpdateV2(this.#doc, update) // updates are idempotent
    this.#undoManager.updateLocal(updatesU8A)
    return this.state
  }

  updateServerState = (changes: UPageChanges) => {
    // TODO: test memory occupation
    this.#doc.once('updateV2', (update: Uint8Array) => {
      const description = describeChanges(changes, update)
      this.#sendUpdate(Bytes.fromUint8Array(update), description)
      this.#undoManager.addChange(update, description?.sha || getSha(update))
    })

    const root = this.#doc.getMap(ROOT)
    const ublocks = root.get(UBLOCKS) as UBlockCRDTs

    this.#doc.transact(() => {
      for (const change of changes) {
        switch (change.t) {
          case 'change-str': {
            const data = getData<Y.Text>(ublocks, change.path)
            applyStrChanges(data, change.changes)
            break
          }
          case 'change-object': {
            const data = getData<Y.Map<unknown>>(ublocks, change.path)
            _updateObjectState(data, change.changes)
            break
          }
          case 'insert': {
            getBlocks(ublocks, change.path).insert(
              +safe(change.path.at(-1)),
              change.ublocks.map((ublock) => {
                const newUBlock = new Y.Map() as UBlockCRDT

                newUBlock.set(ID, ublock.id)
                newUBlock.set(TYPE, ublock.type)
                setBlockData(newUBlock, ublock.data)

                return newUBlock
              }),
            )
            break
          }
          case 'delete':
            getBlocks(ublocks, change.path).delete(+safe(change.path.at(-1)))
            break
          case 'delete-page':
            root.set('isDeleted', true)
            break
          case 'change-root':
            change.changes.changes.forEach((c) => {
              if (c.t === 'delete') root.delete(c.path[0] + '')
              else if (c.t === 'change') root.set(c.path[0] + '', c.value)
            })
            break
          case 'change-type': {
            const block = getBlocks(ublocks, change.path).get(+safe(change.path.at(-1))) as UBlockCRDT
            block.set(TYPE, change.type)
            if (change.data) setBlockData(block, change.data)
            break
          }
        }
      }
    })

    return this.state
  }
}

type UBlockDataCRDT = Y.Text | Y.Map<JSObject>
type UBlockTypeCRDT = str
type UBlockCRDT = YMap<{ id: str; type: UBlockTypeCRDT; data: UBlockDataCRDT }>
type UBlockCRDTs = Y.Array<UBlockCRDT>

// debouncing may lead to increase of incontinencies, clients should sync as fast as possible

const setBlockData = (map: Y.Map<unknown>, data: UBlockData) => {
  setMapData(map, DATA, data)
}

const setMapData = (map: Y.Map<unknown>, key: str, data: unknown) => {
  map.set(key, crdtfy(data))
}

const crdtfy = (data: unknown) => {
  if (isStr(data)) return new Y.Text(data as str)
  else if (Array.isArray(data)) return arrayFrom(data)
  return objectToMap(data as JSObject)
}

const getData = <T>(ublocks: Y.Array<UBlockCRDT>, path: CPath): T => {
  let data = ublocks.get(+safe(path.shift())).get(DATA) as unknown
  if (!path.length) return data as T

  while (path.length) {
    const next = safe(path.shift())
    if (isStr(next)) {
      data = (data as Y.Map<unknown>).get(next as str)
    } else {
      data = (data as Y.Array<unknown>).get(+next)
    }
  }

  return data as T
}

const deletePath = (ublocks: Y.Array<UBlockCRDT>, path: CPath) => {
  let ref = ublocks as any

  while (path.length > 1) {
    const next = safe(path.shift())
    if (isStr(next)) ref = ref.get(next as str)
    else ref = ref.get(+next)
  }

  if (isStr(path[0])) ref.delete(path[0])
  else ref.delete(+path[0])
}

const getBlocks = (ublocks: Y.Array<UBlockCRDT>, path: CPath): Y.Array<unknown> => {
  if (path.length === 1) return ublocks
  let data = ublocks.get(+safe(path.shift())).get(DATA) as unknown

  while (path.length > 1) {
    const next = safe(path.shift())
    if (isStr(next)) {
      data = (data as Y.Map<unknown>).get(next as str)
    } else {
      data = (data as Y.Array<unknown>).get(+next)
    }
  }

  return data as Y.Array<unknown>
}

const createPathWithValue = (blocks: Y.Array<UBlockCRDT>, path: CPath, value: unknown) => {
  let ref = blocks as any
  path.forEach((step, i) => {
    if (i === path.length - 1) {
      if (isStr(step)) setMapData(ref, step as str, value)
      else ref.insert(step, crdtfy(value))
      return
    }

    if (isStr(step) && !ref.has(step)) {
      const newMap = new Y.Map()
      ref.set(step, newMap)
      ref = newMap
    } else if (!isStr(step) && !ref.has(step)) {
      const newArray = new Y.Array()
      ref.set(step, newArray)
      ref = newArray
    } else ref = ref.get(step)
  })
}

// any string is YText - it takes same space as regular one
// change only what differs - it takes less space
const _updateObjectState = (map: Y.Map<unknown>, update: ObjectChanges) => {
  const ublocks = map.get(UBLOCKS) as UBlockCRDTs
  applyObjectChanges(
    {
      change: (p, v) => {
        if (!isStr(p.at(-1))) throw new Error('Impossible array modification')
        const object = getData<Y.Map<unknown>>(ublocks, p)
        object.set(safe(p.at(-1)) + '', v)
      },
      create: (p, v) => createPathWithValue(ublocks, p, v),
      delete: (p) => deletePath(ublocks, p),
      getStrToChange: (p) => getData<Y.Text>(ublocks, p),
    },
    update,
  )
}

const objectToMap = (obj: JSObject): Y.Map<unknown> => {
  const m = new Y.Map()
  Object.entries(obj).forEach(([k, v]) => {
    if (isStr(v)) m.set(k, new Y.Text(v))
    else if (Array.isArray(v)) m.set(k, arrayFrom(v))
    else m.set(k, isStr(v) ? new Y.Text(v) : v)
  })
  return m
}

const arrayFrom = (arr: unknown[]): Y.Array<unknown> => {
  const elements = arr.map((d) => (isStr(d) ? new Y.Text(d as str) : objectToMap(d as JSObject)))
  return Y.Array.from(elements)
}

export const _stateToBase64 = (state: UPageStateCRDT): str => {
  const vector = Y.encodeStateAsUpdateV2(state.doc)
  return fromUint8Array(vector)
}

export const _base64ToState = (base64: str): Bytes[] => {
  return [Bytes.fromUint8Array(toUint8Array(base64))]
}

export const _stateToStr = (state: UPageData): str => state.ublocks.map(ublockToStr).join('_')

const ublockToStr = (b: UBlock): str => {
  if (isStr(b.data)) return b.data as str
  if (Array.isArray(b.data)) return arrToStr(b.data)
  return objToStr(b.data as JSObject)
}

const objToStr = (o: JSObject): str => {
  if ('data' in o && 'type' in o && 'id' in o) return ublockToStr(o as UBlock)
  return `{${Object.values(o)
    .map((v) => (Array.isArray(v) ? arrToStr(v) : v))
    .join(', ')}}`
}

const arrToStr = (arr: unknown[]): str => `[${arr.map((v) => (isStr(v) ? v : objToStr(v as JSObject))).join(', ')}]`

export const _mockServer = (initialUpdates: Bytes[]) => {
  const updates = [] as Bytes[]
  return {
    updates,
    sendUpdate: (u: Bytes) => updates.push(u),
    getInitialUpdates: () => initialUpdates,
  }
}

const docToState = (doc: Y.Doc): UPageData => doc.getMap(ROOT).toJSON() as UPageData
