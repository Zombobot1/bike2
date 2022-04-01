import { bool, num, str } from '../../utils/types'
import { UBlockData, UBlockType } from './UPage/ublockTypes'

export class UPageFocus {
  id = ''
  type: FocusType = 'start'
  xOffset?: num
  fresh?: bool // when created on factory
}

export interface UBlockContent {
  id: str
  type: UBlockType
  data: UBlockData
  setData: (id: str, d: Partial<UBlockData>) => void
  readonly?: bool
}

export type NewBlockFocus = 'focus-start' | 'focus-end' | 'no-focus' | '/'
export type FocusType = 'start' | 'start-integer' | 'end' | 'end-integer'
export type SetUBlockType = (id: str, type: UBlockType, data?: str, focus?: FocusType) => void

// export type InitialData = { data: str; type: UBlockType }
// export class BlockInfo {
//   type: UBlockType = 'text'
//   data = ''
//   i = -1
//   setId = ''
//   scrollTo?: Fn
//   offset?: num
//   typesStrike?: num
//   isOpen?: bool
// }

// export type ArrowNavigationFn = (id: str, xOffset?: num) => void
// export type SplitList = (list: { id: str; wasRemoved?: bool }, splitOnId: str, newListId: str, newListData: str) => void

// export type UTextFocus = { type: FocusType; xOffset?: num; forceUpdate?: bool }
// export type SetFocus = (f?: UTextFocus) => void

export type InlineEditorExit = 'click' | 'key'
export enum DragType {
  ublock = 'ublock',
  uformBlock = 'uformBlock',
}
export type TeX = { tex: str; html: str; wasUpdated?: bool }
export type TexMapRef = React.MutableRefObject<Map<str, TeX>>

// export type SetIds = (f: (old: strs) => strs) => void

// export class AddedBlock {
//   id = ''
//   data = ''
//   type: UBlockType = 'text'
// }
// export type AddedBlocks = AddedBlock[]
