import { immerable } from 'immer'
import { str, strs } from '../../../../utils/types'
import { UPageFocus } from '../../types'
import { UBlockType } from '../ublockTypes'

export interface TOC {
  id: str
  type: UBlockType
  data: str
}
export type TOCs = TOC[]

export class UPageCursor {
  [immerable] = true

  focus?: UPageFocus
  selected = [] as strs
  isDragging = false
}
