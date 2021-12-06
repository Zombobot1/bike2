import { bool, Fn, num, str } from '../../utils/types'

export type UListBlock = 'list' | 'bullet-list' | 'numbered-list'
export type AdvancedTextBlock = 'code' | 'quote' | 'callout'
export type HeadingBlock = 'heading-1' | 'heading-2' | 'heading-3' | 'heading-0'
export type UTextBlock = 'text' | HeadingBlock | UListBlock | AdvancedTextBlock
export type UFileBlock = 'file' | 'image' | 'audio' | 'video'
export type UQuestionBlock = 'single-choice' | 'short-answer' | 'multiple-choice' | 'long-answer' | 'inline-exercise'
export type UFormBlock = 'test' | 'exercise' | 'question'
export type UProjectionBlock = 'page' | UFormBlock
type PseudoUBlock = 'inline-equation'
type UBlocks = 'block-equation' | 'divider' | 'table' | 'cards' | PseudoUBlock
export type UBlockType = UTextBlock | UFileBlock | UQuestionBlock | UProjectionBlock | UBlocks
export type UBlockTypes = UBlockType[]

export function isUTextBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = [
    'text',
    'heading-1',
    'heading-2',
    'heading-3',
    'heading-0',
    'list',
    'bullet-list',
    'numbered-list',
    'callout',
    'quote',
    'code',
  ]
  return types.includes(t)
}

export function isNotFullWidthBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['image', 'video', 'table']
  return types.includes(t) // isUFormComponent(t) || causes cypress error
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
  const types: UBlockTypes = ['list', 'bullet-list', 'numbered-list']
  return types.includes(t)
}

export function isUFormBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['test', 'exercise', 'question']
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

export interface UBlockB {
  id: str
  readonly?: bool
}

export type UBlockDTO = { type: UBlockType; data: str; isDeleted?: bool }

export interface UBlockComponentB {
  data: str
  setData: (d: str) => void
  readonly?: bool
}

export interface UBlockComponent extends UBlockComponentB {
  type: UBlockType
}

export type NewBlockFocus = 'focus-start' | 'focus-end' | 'no-focus'
export type AddNewBlockUText = (
  underId: str,
  focus?: NewBlockFocus,
  data?: str,
  type?: UBlockType,
  offset?: num,
) => void
export type InitialData = { data: str; type: UBlockType }
export type BlockInfo = { type: UBlockType; data: str; i: num; scrollTo?: Fn; offset?: num; typesStrike?: num }

export type SetUBlockType = (type: UBlockType, data?: str, focus?: FocusType) => void
export type ArrowNavigationFn = (id: str, xOffset?: num) => void

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

export const regexAndType = new Map<str, UBlockType>([
  ['#', 'heading-1'],
  ['##', 'heading-2'],
  ['###', 'heading-3'],
  ['{}', 'short-answer'],
  ['[]', 'multiple-choice'],
  ['()', 'single-choice'],
  ['{ }', 'long-answer'],
  ['*', 'bullet-list'],
  ['1.', 'numbered-list'],
])
