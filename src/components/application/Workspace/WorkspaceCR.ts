/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Y from 'yjs'

import { sendWorkspaceUpdate } from '../../../fb/upageChangesAPI'
import { f } from '../../../utils/types'
import { WorkspaceStructure } from './types'
import { Patch } from 'immer'
import { CRDT } from '../../../utils/wrappers/CRDT'

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
  #cr: CRDT

  constructor(updates: Bytes[], sendUpdate = sendWorkspaceUpdate) {
    this.#cr = new CRDT(
      updates,
      (doc) => doc.getMap('ws'),
      (update) => sendUpdate(update),
      f,
    )
  }

  get state(): WorkspaceStructure {
    return this.#cr.data as WorkspaceStructure
  }

  applyUpdate = (updates: Bytes[]): WorkspaceStructure | undefined => {
    if (this.#cr.applyUpdate(updates)) return this.state
  }

  change = (changes: Patch[]) => this.#cr.change(changes)
}
