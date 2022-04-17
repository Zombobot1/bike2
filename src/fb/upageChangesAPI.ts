import { Bytes } from 'firebase/firestore'
import { getUserId } from '../components/editing/UPage/userId'
import { str, strs } from '../utils/types'
import { now } from '../utils/wrappers/timeUtils'
import { uuid } from '../utils/wrappers/uuid'
import { UPageChangeDescriptionDTO } from './FSSchema'
import { backend } from './useData'
import { isInProduction } from './utils'

export type SendUPageUpdate = (id: str, update: Bytes, description: UPageChangeDescriptionDTO) => void
export function sendUPageUpdate(id: str, update: Bytes, description: UPageChangeDescriptionDTO) {
  backend.appendDataToArray('upages', id, 'updates', update)
  backend.setData('upageChanges', uuid(), description)
}

export type DeleteUPageUpdates = (id: str, _updatesLeft: Bytes[], _shas: strs) => void
export function deleteUPageUpdates(id: str, _updatesLeft: Bytes[], _shas: strs) {
  backend.setData('upages', id, { updates: _updatesLeft })
  // TODO: delete shas
}

export async function moveBlocks(pageId: str, handleMove: (pageUpdates: Bytes[]) => void) {
  const page = await backend.getData('upages', pageId)
  handleMove(page.updates)
}

export function sendWorkspaceUpdate(update: Bytes) {
  if (!isInProduction) return
  backend.appendDataToArray('workspaces', getUserId(), 'updates', update)
}

export function deleteFile(src: str, upageId: str) {
  backend.setData('deletedFiles', uuid(), { src, upageId, deletedAt: now() })
}
