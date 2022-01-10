import { bool, Fn, num, SetStr, SetStrs, str, strs } from '../../utils/types'
import { UPageSelectionD } from './UPage/hooks/useUpageSelection'
import { UPageFocusD } from './UPage/hooks/useUPageFocus'

export type UListBlock = 'bullet-list' | 'numbered-list' | 'toggle-list'
export type AdvancedTextBlock = 'code' | 'quote' | 'callout'
export type HeadingBlock = 'heading-1' | 'heading-2' | 'heading-3' | 'heading-0'
export type UTextBlock = 'text' | HeadingBlock | AdvancedTextBlock
export type UFileBlock = 'file' | 'image' | 'audio' | 'video'
export type UQuestionBlock = 'single-choice' | 'short-answer' | 'multiple-choice' | 'long-answer' | 'inline-exercise'
export type UFormBlock = 'test' | 'exercise' | 'card'
export type UProjectionBlock = 'grid' | 'page' | UFormBlock | UListBlock
type PseudoUBlock = 'inline-equation'
type UBlocks = 'block-equation' | 'divider' | 'table' | 'cards' | PseudoUBlock
export type UBlockType = UTextBlock | UFileBlock | UQuestionBlock | UProjectionBlock | UBlocks
export type UBlockTypes = UBlockType[]

export function isUTextBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['text', 'heading-1', 'heading-2', 'heading-3', 'heading-0', 'callout', 'quote', 'code']
  return types.includes(t)
}

export function isNotFullWidthBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['image', 'video', 'table']
  return types.includes(t) || isUQuestionBlock(t)
}

export function isSelectableByClickBlock(t?: UBlockType): bool {
  if (!t) return false
  return t === 'image' || t === 'divider'
}

export function isAdvancedText(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['code', 'quote', 'callout']
  return types.includes(t)
}

export function isPlainTextBlock(t?: UBlockType): bool {
  if (!t) return false
  return isUTextBlock(t) && !isAdvancedText(t)
}

export function isIndexableBLock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['heading-1', 'heading-2', 'heading-3', 'cards', 'exercise']
  return types.includes(t)
}

export function isUListBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['bullet-list', 'numbered-list', 'toggle-list']
  return types.includes(t)
}

export function isFlat(t?: UBlockType): bool {
  if (!t) return false
  return t !== 'grid' && !isUListBlock(t)
}

export function mayContainPages(t?: UBlockType): bool {
  return !isFlat(t)
}

export function isUFormBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['test', 'exercise', 'card']
  return types.includes(t)
}

export function isUQuestionBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['single-choice', 'short-answer', 'multiple-choice', 'long-answer', 'inline-exercise']
  return types.includes(t)
}

export function isUFileBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['file', 'image', 'audio', 'video']
  return types.includes(t)
}

export type UBlockSetUpdate = { id: str; toInsert?: strs; toDelete?: strs; deletePermanently?: bool }
export type UBlockSetUpdates = UBlockSetUpdate[]
export type UBlockDTO = { type: UBlockType; data: str; isDeleted?: bool }

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

export class UGridDTO {
  columns: strs[] = []
  ids: strs = []
  widths: strs = []
}

export type SetIds = (f: (old: strs) => strs) => void

export class AddedBlock {
  id = ''
  data = ''
  type: UBlockType = 'text'
}
export type AddedBlocks = AddedBlock[]
