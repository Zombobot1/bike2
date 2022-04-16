import { Bytes } from 'firebase/firestore'
import { str, strs } from '../utils/types'
import { uuid } from '../utils/wrappers/uuid'
import { TrainingDTO, UPageChangeDescriptionDTO } from './FSSchema'
import { backend } from './useData'

export function sendIdeaUpdate(id: str, update: Bytes, description: UPageChangeDescriptionDTO) {
  backend.appendDataToArray('ideas', id, 'updates', update)
  backend.addData('upageChanges', uuid(), description)
}

export type DeleteUPageUpdates = (id: str, updatesLeft: Bytes[], _shas: strs) => void
export function deleteIdeaUpdates(id: str, updatesLeft: Bytes[], _shas: strs) {
  backend.setData('ideas', id, { updates: updatesLeft })
  // TODO: delete shas
  // TODO: when upage is deleted in cleanUp delete all its changes (in cloud function if it's cheaper)
}

export function setTraining(id: str, training: Partial<TrainingDTO>) {
  backend.setData('trainings', id, training)
}
