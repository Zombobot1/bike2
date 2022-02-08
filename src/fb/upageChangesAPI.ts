import { Bytes } from 'firebase/firestore'
import { num, str, strs } from '../utils/types'
import { isInProduction } from './utils'

// caused unnecessary imports when was defined in useData
export function deleteUPageUpdates(_updates: Bytes[], _shas: strs) {
  if (!isInProduction) return
}

export interface UPageChangeDescriptionDTO {
  sha: str
  user: str
  date: num
  preview: str
  block?: str
}

export function sendUPageUpdate(_update: Bytes, _description?: UPageChangeDescriptionDTO) {
  if (!isInProduction) return
}
