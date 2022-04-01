import { Fn, num, State, str, f } from '../../../utils/types'
import { SetUBlockType, UBlockContent, UPageFocus } from '../types'
import { UBlockContext, UBlockType } from '../UPage/ublockTypes'

export interface FocusManagement {
  focusS: State<UPageFocus | undefined>
  goUp: (id: str, xOffset?: num) => void
  goDown: (id: str, xOffset?: num) => void
  resetActiveBlock: Fn
}

export interface UTextEventsHandlers {
  onUTextTab: (id: str, data: str) => void
  onUTextShiftTab: (id: str, data: str) => void
  onUTextBackspace: (id: str, data: str) => void
  onUTextEnter: (dataAbove: str, dataBelow: str, underId: str) => void
  onUTextPaste: (data: str, underId: str, type?: UBlockType) => void
}

export interface UText extends UBlockContent, FocusManagement, UTextEventsHandlers {
  context: UBlockContext
  placeholder?: str
  setType: SetUBlockType
  addUBlock: (underId: str, type: UBlockType) => void
}

export const _mockUTextP: UText = {
  addUBlock: f,
  context: 'upage',
  data: '',
  focusS: [undefined, f],
  goDown: f,
  goUp: f,
  id: '',
  onUTextBackspace: f,
  onUTextEnter: f,
  onUTextPaste: f,
  onUTextShiftTab: f,
  onUTextTab: f,
  resetActiveBlock: f,
  setData: f,
  setType: f,
  type: 'text',
}
