/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Y from 'yjs'
import { Bytes } from 'firebase/firestore'

import { bool, Fn, JSObject, num, str, strs } from '../types'
import { isObjOrArr, isStr, safe } from '../utils'
import { getSha } from './shaUtils'
import { Patch } from 'immer'

type OnUpdate = (update: Bytes, rawUpdate: Uint8Array) => void
type OnRollback = (updatesLeft: Bytes[], deletedShas: strs) => void
type GetRoot = (doc: Y.Doc) => Y.Map<any>

export class CRDT {
  doc: Y.Doc
  #getRoot: GetRoot
  #undoManager: Y.UndoManager
  #updates: Uint8Array[]
  #lastUpdate?: Bytes
  #onUpdate: OnUpdate
  #onRollBack: OnRollback

  constructor(updates: Bytes[], getRoot: GetRoot, onUpdate: OnUpdate, onRollBack: OnRollback) {
    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    this.#lastUpdate = safe(updates.at(-1))

    this.doc = ydocFromArrays(this.#updates)
    this.#getRoot = getRoot
    this.#undoManager = new Y.UndoManager(this.#getRoot(this.doc), { captureTimeout: 0 })

    this.#onUpdate = onUpdate
    this.#onRollBack = onRollBack
  }

  get data(): JSObject {
    return this.#getRoot(this.doc).toJSON()
  }

  getRootRef = <T extends Record<str, unknown>>(): YObject<T> => this.#getRoot(this.doc) as YObject<T>

  applyUpdate = (updates: Bytes[]): bool => {
    if (updates.length === this.#updates.length && this.#lastUpdate && updates.at(-1)?.isEqual(this.#lastUpdate))
      return false

    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    const update = Y.mergeUpdatesV2(u8a)
    Y.applyUpdateV2(this.doc, update) // updates are idempotent -> applying existing updates is fine
    // this.#tree // all doc references are valid after updates merge (tested on Y.Text)
    return true
  }

  change = (changesOrChanger: Patch[] | Fn) => {
    if (Array.isArray(changesOrChanger))
      this.#change(() =>
        this.doc.transact(() => {
          const root = this.#getRoot(this.doc)
          changesOrChanger.forEach(({ op, path, value }) => {
            if (path.includes('length')) return // https://github.com/immerjs/immer/issues/208#issuecomment-996064385
            if (op === 'add') createPath(path, root, value)
            else if (op === 'remove') deletePath(path, root)
            else changePath(path, root, value)
          })
        }),
      )
    else this.#change(() => this.doc.transact(changesOrChanger))
  }

  undo = () => this.#change(() => this.#undoManager.undo())
  redo = () => this.#change(() => this.#undoManager.redo())

  rollBackTo = (sha: str) => {
    const shas = [] as strs

    for (let i = this.#updates.length - 1; i > -1; i--) {
      const updateSha = getSha(this.#updates[i])

      if (updateSha === sha) {
        // probably a better way
        // const updatesToDelete = this.#updates.slice(i + 1).map((u) => Bytes.fromUint8Array(u))
        this.#updates = this.#updates.slice(0, i + 1)

        this.doc = ydocFromArrays(this.#updates)
        this.#undoManager = new Y.UndoManager(this.#getRoot(this.doc), { captureTimeout: 0 })
        return this.#onRollBack(
          this.#updates.map((u) => Bytes.fromUint8Array(u)),
          shas,
        )
      }

      shas.push(updateSha)
    }
  }

  #change = (changeFn: () => void) => {
    let update: Uint8Array | undefined

    this.doc.once('updateV2', (u: Uint8Array) => {
      update = u
    })

    changeFn()

    if (update) {
      const bytes = Bytes.fromUint8Array(update)
      this.#updates.push(update)
      this.#lastUpdate = bytes
      this.#onUpdate(bytes, update)
    }
  }
}

// https://github.com/yjs/yjs/issues/352#issuecomment-1000453944
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type YObject<TObject extends Record<str, unknown>> = Y.Map<any> & {
  get<TKey extends keyof TObject>(key: TKey): TObject[TKey]
  set<TKey extends keyof TObject>(key: TKey, value: TObject[TKey]): void
  has<TKey extends keyof TObject>(key: TKey): boolean
  toJSON<T = TObject>(): T
}

const bytesToU8A = (bytes: Bytes[]) => bytes.map((v) => v.toUint8Array())

function ydocFromArrays(arrays: Uint8Array[]): Y.Doc {
  const doc = new Y.Doc()
  const update = Y.mergeUpdatesV2(arrays)
  Y.applyUpdateV2(doc, update)
  return doc
}

type Path = Array<str | num>

function createPath(path: Path, ref: any, value: any) {
  path.forEach((step, i) => {
    if (i === path.length - 1) {
      if (isStr(step)) ref.set(step, crdtfy(value))
      else ref.insert(step, [crdtfy(value)])
      return
    }

    const currentStep = step
    const nextStep = path[i + 1]

    if (!isStr(currentStep)) {
      const i = currentStep as num
      if (ref.length < i) {
        const nextRef = isStr(nextStep) ? new Y.Map() : new Y.Array()
        ref.insert(i, [nextRef])
        ref = nextRef
      } else ref = ref.get(i)
    } else {
      if (!ref.has(step)) {
        const nextRef = isStr(nextStep) ? new Y.Map() : new Y.Array()
        ref.set(i, nextRef)
        ref = nextRef
      } else ref = ref.get(step)
    }
  })
}

function deletePath(path: Path, ref: any) {
  path.forEach((step, i) => {
    if (i === path.length - 1) ref.delete(step)
    else ref = ref.get(step)
  })
}

function changePath(path: Path, ref: any, value: any) {
  path.forEach((step, i) => {
    if (i === path.length - 1) {
      if (isStr(step)) ref.set(step, crdtfy(value))
      else {
        ref.delete(step)
        ref.insert(step, [crdtfy(value)])
      }
      return
    } else ref = ref.get(step)
  })
}

function arrToCR(value: any) {
  const r = new Y.Array()

  value.forEach((v: any) => {
    if (Array.isArray(v)) r.push([arrToCR(v)])
    if (isObjOrArr(v)) r.push([objToCR(v)])
    else r.push(v)
  })

  return r
}

function objToCR(value: any) {
  const r = new Y.Map()

  Object.entries(value).forEach(([k, v]) => {
    if (Array.isArray(v)) r.set(k, arrToCR(v))
    else if (isObjOrArr(v)) r.set(k, objToCR(v))
    else r.set(k, v)
  })

  return r
}

function crdtfy(value: any) {
  if (Array.isArray(value)) return arrToCR(value)
  if (isObjOrArr(value)) return objToCR(value)
  return value
}
