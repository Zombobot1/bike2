import { bool, Fn, SetStr, str } from '../../../utils/types'
import { AddNewBlockUText, ArrowNavigationFn, BlockInfo, SetUBlockType, UBlockComponent, UTextFocus } from '../types'

export interface UText extends UBlockComponent {
  id: str
  tryToChangeFieldType: SetStr
  setType: SetUBlockType
  addInfo?: (id: str, i: BlockInfo) => void
  addData?: (id: str, i: str) => void
  appendedData?: str
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
}

export class UListDTO {
  text = ''
  offset = 1
}
