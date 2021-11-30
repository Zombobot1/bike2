import { bool, Fn, SetStr, str } from '../../../utils/types'
import { AddNewBlockUText, ArrowNavigationFn, BlockInfo, SetUBlockType, UBlockComponent, UTextFocus } from '../types'

export interface UText extends UBlockComponent {
  id: str
  setType: SetUBlockType
  tryToChangeFieldType: SetStr
  inUForm?: bool
  addInfo?: (id: str, i: BlockInfo) => void
  addData?: (id: str, i: str) => void
  appendedData?: str
  initialData?: str
  previousBlockInfo?: BlockInfo
  focus?: UTextFocus
  addNewBlock: AddNewBlockUText
  placeholder?: str
  deleteBlock?: (data?: str) => void
  isFactory?: bool
  onFactoryBackspace?: Fn
  onTitleEnter?: Fn
  isCardField?: bool
  goUp?: ArrowNavigationFn
  goDown?: ArrowNavigationFn
  clearFocus?: Fn
  hideMenus?: bool
}

export class UListDTO {
  text = ''
  offset = 1
}
