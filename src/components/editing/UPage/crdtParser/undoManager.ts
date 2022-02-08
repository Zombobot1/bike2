import { Bytes } from 'firebase/firestore'
import * as Y from 'yjs'
import { deleteUPageUpdates } from '../../../../fb/upageChangesAPI'
import { insertAt, removeAt } from '../../../../utils/algorithms'
import { getSha } from '../../../../utils/wrappers/shaUtils'
import { num, str, strs } from '../../../../utils/types'
import { safe } from '../../../../utils/utils'

// Some undo are dangerous: if users make changes to one y text they will undo each other changes
export class UndoManager {
  #localChanges = [] as strs
  #undoneLocalChanges = [] as strs
  #updates = [] as Uint8Array[]
  #undoneUpdates = [] as [Uint8Array, num][]
  #deleteUPageChanges: (_updates: Bytes[], _shas: strs) => void

  constructor(updates: Uint8Array[], deleteChanges = deleteUPageUpdates) {
    this.#updates = updates
    this.#deleteUPageChanges = deleteChanges
  }

  addChange = (update: Uint8Array, sha: str) => {
    if (this.#undoneUpdates.length) {
      this.#deleteUPageChanges(
        this.#undoneUpdates.map(([u]) => Bytes.fromUint8Array(u)),
        [...this.#undoneLocalChanges],
      )
      this.#clearStack()
    }

    this.#updates.push(update)
    this.#localChanges.push(sha)
  }

  updateLocal = (updates: Uint8Array[]) => {
    this.#updates = updates
  }

  undo = (): Y.Doc => {
    if (this.#localChanges.length) {
      for (let i = this.#updates.length - 1; i > -1; i--) {
        if (getSha(this.#updates[i]) === this.#localChanges.at(-1)) {
          this.#undoneUpdates.unshift([this.#updates[i], i])
          this.#updates = removeAt(this.#updates, i)
        }
      }

      this.#undoneLocalChanges.unshift(safe(this.#localChanges.pop()))
    }

    return ydocFromArrays(this.#updates)
  }

  redo = (): Y.Doc => {
    if (this.#undoneUpdates.length) {
      const [update, i] = safe(this.#undoneUpdates.shift())
      this.#updates = insertAt(this.#updates, i, update)
      this.#localChanges.push(safe(this.#undoneLocalChanges.shift()))
    }

    return ydocFromArrays(this.#updates)
  }

  rollBackTo = (sha: str): Y.Doc => {
    const shas = [] as strs
    for (let i = this.#updates.length - 1; i > -1; i--) {
      const updateSha = getSha(this.#updates[i])

      if (updateSha === sha) {
        this.#updates = this.#updates.slice(0, i + 1)
        this.#deleteUPageChanges(
          [...this.#undoneUpdates.map(([u]) => u), ...this.#updates.slice(i + 1)].map((u) => Bytes.fromUint8Array(u)),
          [...this.#undoneLocalChanges, ...shas],
        )
        this.#clearStack()
        return ydocFromArrays(this.#updates)
      }

      shas.push(updateSha)
    }

    throw new Error('Change not found')
  }

  #clearStack = () => {
    this.#undoneUpdates = []
    this.#undoneLocalChanges = []
  }
}

export function ydocFromBytes(bytes: Bytes[]): Y.Doc {
  return ydocFromArrays(bytes.map((v) => v.toUint8Array()))
}

function ydocFromArrays(arrays: Uint8Array[]): Y.Doc {
  const doc = new Y.Doc()
  const update = Y.mergeUpdatesV2(arrays)
  Y.applyUpdateV2(doc, update)
  return doc
}
