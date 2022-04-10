/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Y from 'yjs'

import { sendWorkspaceUpdate } from '../../../fb/upageChangesAPI'
import { isObjOrArr, isStr } from '../../../utils/utils'
import { num, str } from '../../../utils/types'
import { WorkspaceStructure } from './types'
import { Patch } from 'immer'

import { Bytes } from 'firebase/firestore'
export function getInitialWorkspace() {
  const doc = new Y.Doc()
  const ws = doc.getMap('ws')
  ws.set('pages', new Y.Array())
  ws.set('trash', new Y.Array())
  const bytes = Y.encodeStateAsUpdateV2(doc)
  return [Bytes.fromUint8Array(bytes)]
}

export class WorkspaceCR {
  #doc: Y.Doc
  #updates: Uint8Array[]
  #sendUpdate: (_update: Bytes) => void
  #lastUpdate?: Bytes
  #ws: Y.Map<any>

  constructor(updates: Bytes[], sendUpdate = sendWorkspaceUpdate) {
    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    this.#doc = ydocFromArrays(this.#updates)
    this.#ws = this.#doc.getMap('ws')

    this.#sendUpdate = sendUpdate
    this.#lastUpdate = updates[0]
  }

  get state(): WorkspaceStructure {
    return this.#ws.toJSON() as WorkspaceStructure
  }

  get updates(): Bytes[] {
    return this.#updates.map((update) => Bytes.fromUint8Array(update))
  }

  applyUpdate = (updates: Bytes[]): WorkspaceStructure | undefined => {
    if (updates.length === this.#updates.length && this.#lastUpdate && updates.at(-1)?.isEqual(this.#lastUpdate)) return

    const u8a = bytesToU8A(updates)
    this.#updates = u8a
    const update = Y.mergeUpdatesV2(u8a)
    Y.applyUpdateV2(this.#doc, update)
    return this.state
  }

  change = (changes: Patch[]) => {
    let update: Uint8Array | undefined

    this.#doc.once('updateV2', (u: Uint8Array) => {
      update = u
    })

    this.#doc.transact(() => {
      changes.forEach(({ op, path, value }) => {
        if (path.includes('length')) return // https://github.com/immerjs/immer/issues/208#issuecomment-996064385
        if (op === 'add') createPath(path, this.#ws, value)
        else if (op === 'remove') deletePath(path, this.#ws)
        else changePath(path, this.#ws, value)
      })
    })

    if (update) this.#sendUpdate(Bytes.fromUint8Array(update))
  }
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
