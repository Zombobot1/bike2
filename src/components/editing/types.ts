import { bool, Fn, num, SetStr, SetStrs, str, strs } from '../../utils/types'
import { UPageSelectionD } from './UPage/hooks/useUpageSelection'
import { UPageFocusD } from './UPage/hooks/useUPageFocus'
import { UBlockType } from './UPage/types'

export type UBlockSetUpdate = { id: str; toInsert?: strs; toDelete?: strs; deletePermanently?: bool }
export type UBlockSetUpdates = UBlockSetUpdate[]

export class ActiveBlock {
  id = ''
  ulistId?: str
  focus?: UTextFocus
  appendedData?: str
}

export interface UBlockRecursivePs {
  focusD: UPageFocusD
  selectionD: UPageSelectionD
  deleteUPage: SetStrs
  createUPage: SetStr
  ublockSetUpdates?: UBlockSetUpdates
}

export interface UBlockImplementation {
  id: str
  type: UBlockType
  data: str
  setData: SetStr
  readonly?: bool
}

export type NewBlockFocus = 'focus-start' | 'focus-end' | 'no-focus' | '/'
export type AddNewBlockUText = (underId: str, focus?: NewBlockFocus, data?: str, type?: UBlockType) => void
export type InitialData = { data: str; type: UBlockType }
export class BlockInfo {
  type: UBlockType = 'text'
  data = ''
  i = -1
  setId = ''
  scrollTo?: Fn
  offset?: num
  typesStrike?: num
  isOpen?: bool
}

export type SetUBlockType = (type: UBlockType, data?: str, focus?: FocusType) => void
export type ArrowNavigationFn = (id: str, xOffset?: num) => void
export type SplitList = (list: { id: str; wasRemoved?: bool }, splitOnId: str, newListId: str, newListData: str) => void

export type FocusType = 'start' | 'start-integer' | 'end' | 'end-integer'
export type UTextFocus = { type: FocusType; xOffset?: num; forceUpdate?: bool }
export type SetFocus = (f?: UTextFocus) => void

export type InlineEditorExit = 'click' | 'key'
export enum DragType {
  ublock = 'ublock',
  uformBlock = 'uformBlock',
}
export type TeX = { tex: str; html: str; wasUpdated?: bool }
export type TexMapRef = React.MutableRefObject<Map<str, TeX>>

export type SetIds = (f: (old: strs) => strs) => void

export class AddedBlock {
  id = ''
  data = ''
  type: UBlockType = 'text'
}
export type AddedBlocks = AddedBlock[]
