import { bool, Fn, SetStr, str } from '../../../utils/types'
import { AddNewBlockUText, ArrowNavigation, BlockInfo, SetUBlockType, UBlockComponent, UTextFocus } from '../types'

export interface UText extends UBlockComponent {
  tryToChangeFieldType: SetStr
  setType: SetUBlockType
  addInfo?: (i: BlockInfo) => void
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
  arrowNavigation?: ArrowNavigation
  clearFocus?: Fn
}

export class UListDTO {
  text = ''
  offset = 1
}
