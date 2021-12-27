import { bool, Fn, SetStr, str } from '../../../utils/types'
import {
  AddNewBlockUText,
  ArrowNavigationFn,
  BlockInfo,
  SetUBlockType,
  UBlockImplementation,
  UTextFocus,
} from '../types'

export interface FocusManagement {
  focus?: UTextFocus

  goUp: ArrowNavigationFn
  goDown: ArrowNavigationFn
  resetActiveBlock: Fn
}

export interface ToggleableText {
  toggleListOpen?: SetStr
  openToggleParent?: SetStr
  isToggleOpen?: bool
}

export interface AuxiliaryText {
  isFactory?: bool
  onFactoryBackspace?: Fn
  onTitleEnter?: Fn
  hideMenus?: bool
}

export interface UText extends AuxiliaryText, FocusManagement, ToggleableText, UBlockImplementation {
  setType: SetUBlockType
  inUForm?: bool
  appendedData?: str
  initialData?: str
  previousBlockInfo?: BlockInfo

  placeholder?: str
  addNewBlock: AddNewBlockUText
  deleteBlock?: (id: str, data?: str) => void
  isCardField?: bool
}

export class UListDTO {
  text = ''
  offset = 1 // to use !offset
}
