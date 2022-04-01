import { Bytes } from 'firebase/firestore'
import { ChangePreview } from '../components/editing/UPage/UPageState/crdtParser/previewGeneration'
import { num, str, strs } from '../utils/types'
import { now } from '../utils/wrappers/timeUtils'
import { uuid } from '../utils/wrappers/uuid'
import { cls } from './cls'
import { backend } from './useData'
import { isInProduction } from './utils'

export interface UPageChangeDescriptionDTO {
  sha: str
  user: str
  date: num
  preview: ChangePreview
  block?: str
}

export type UPageChangeDescriptionDTOs = UPageChangeDescriptionDTO[]

export function sendUPageUpdate(id: str, update: Bytes, description: UPageChangeDescriptionDTO) {
  backend.appendDataToArray(cls.upages, id, cls.upageUpdates, update)
  backend.addData(cls.upages, uuid(), description, cls.upageHistory)
}

export function deleteUPageUpdates(id: str, _updatesLeft: Bytes[], _shas: strs) {
  backend.setData(cls.upages, id, { updates: _updatesLeft })
  // TODO: delete shas
}

export async function moveBlocks(pageId: str, handleMove: (pageUpdates: Bytes[]) => void) {
  const page = await backend.getData<{ updates: Bytes[] }>(cls.upages, pageId)
  handleMove(page.updates)
}

export function sendWorkspaceUpdate(_update: Bytes) {
  if (!isInProduction) return
}

export function deleteFile(src: str) {
  backend.setData(cls.deletedFiles, uuid(), { src, deletedAt: now() })
}
