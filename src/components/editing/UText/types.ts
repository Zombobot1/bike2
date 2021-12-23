import { bool, Fn, num, SetStr, str } from '../../../utils/types'
import { AddNewBlockUText, ArrowNavigationFn, BlockInfo, SetUBlockType, UBlockComponent, UTextFocus } from '../types'

export interface UText extends UBlockComponent {
  id: str
  setType: SetUBlockType
  tryToChangeFieldType: SetStr
  i: num
  inUForm?: bool
  addInfo?: (id: str, i: BlockInfo) => void
  appendedData?: str
  initialData?: str
  previousBlockInfo?: BlockInfo
  focus?: UTextFocus
  addNewBlock: AddNewBlockUText
  placeholder?: str
  deleteBlock?: (id: str, data?: str) => void
  isFactory?: bool
  onFactoryBackspace?: Fn
  onTitleEnter?: Fn
  isCardField?: bool
  goUp?: ArrowNavigationFn
  goDown?: ArrowNavigationFn
  clearFocus?: Fn
  hideMenus?: bool
  toggleListOpen?: SetStr
  openToggleParent?: SetStr
  isToggleOpen?: bool
}

export class UListDTO {
  text = ''
  offset = 1 // to use !offset
}
