import { Fn, num, str } from '../../../../utils/types'
import { UBlockType } from '../../types'

export interface TOCItem {
  id: str
  data: str
  type: UBlockType
  i: num
  scrollTo?: Fn
}
export type TOCItems = TOCItem[]

export interface TOCItem_ {
  id: str
  data: str
  scrollTo?: Fn
  children?: TOCItem_[]
}

export type TOCItems_ = TOCItem_[]
