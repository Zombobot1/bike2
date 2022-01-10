import { bool, Fn, num, SetState, SetStr, str } from '../../../utils/types'
import { AddNewBlockUText, ArrowNavigationFn, SetUBlockType, UBlockImplementation, UTextFocus } from '../types'
import { UListMerge } from '../UPage/blockIdAndInfo'

export interface FocusManagement {
  focus?: UTextFocus
  setFocus: SetState<UTextFocus | undefined>
  appendedData?: str

  goUp: ArrowNavigationFn
  goDown: ArrowNavigationFn
  resetActiveBlock: Fn
}

export interface TextInUList {
  openToggleParent?: SetStr
  moveIdInList?: (id: str, direction: 'left' | 'right') => void
}

export interface UText extends FocusManagement, TextInUList, UBlockImplementation {
  setType: SetUBlockType
  inUForm?: bool
  initialData?: str
  previousBlockInfo?: { offset?: num; typesStrike?: num }

  placeholder?: str
  addNewBlocks: AddNewBlockUText
  deleteBlock: (id: str, data?: str) => void
  mergeLists: (m: UListMerge) => void
  isCardField?: bool
}
