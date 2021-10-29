import { bool, num, str } from '../../utils/types'

export type UListComponent = 'list' | 'bullet-list' | 'numbered-list'
export type AdvancedTextComponent = 'code' | 'quote' | 'callout'
export type HeadingComponent = 'heading1' | 'heading2' | 'heading3' | 'heading0'
export type UTextComponent = 'text' | HeadingComponent | UListComponent | AdvancedTextComponent
export type UFileComponent = 'file' | 'image' | 'audio'
export type UFormBlockComponent = 'radio' | 'input' | 'checks' | 'textarea' | 'inline-question'
export type UFormComponent = 'test' | 'exercise' | 'question'
export type UProjectionComponent = 'page' | UFormComponent
export type UComponentType = UTextComponent | UFileComponent | UFormBlockComponent | UProjectionComponent

export function isUTextComponent(t?: UComponentType): bool {
  if (!t) return false
  const types: UComponentType[] = [
    'text',
    'heading1',
    'heading2',
    'heading3',
    'heading0',
    'list',
    'bullet-list',
    'numbered-list',
    'callout',
    'quote',
    'code',
  ]
  return types.includes(t)
}

export function isNotFullWidthComponent(t?: UComponentType): bool {
  if (!t) return false
  return isUFormComponent(t) || t === 'image'
}

export function isAdvancedText(t?: UComponentType): bool {
  if (!t) return false
  const types: UComponentType[] = ['code', 'quote', 'callout']
  return types.includes(t)
}

export function isPlainTextComponent(t?: UComponentType): bool {
  if (!t) return false
  return isUTextComponent(t) && !isAdvancedText(t)
}

export function isUListComponent(t?: UComponentType): bool {
  if (!t) return false
  const types: UComponentType[] = ['list', 'bullet-list', 'numbered-list']
  return types.includes(t)
}

export function isUFormComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['test', 'exercise', 'question']
  return types.includes(t)
}

export function isUFormBlockComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['radio', 'input', 'checks', 'textarea', 'inline-question']
  return types.includes(t)
}

export function isUFileComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['file', 'image', 'audio']
  return types.includes(t)
}

export interface UBlockB {
  id: str
  readonly?: bool
}

export type UBlockDTO = { type: UComponentType; data: str; isDeleted?: bool }

export interface UBlockComponentB {
  data: str
  setData: (d: str) => void
  readonly?: bool
}

export interface UBlockComponent extends UBlockComponentB {
  type: UComponentType
}

export type NewBlockFocus = 'focus-start' | 'focus-end' | 'no-focus'
export type AddNewBlockUText = (focus?: NewBlockFocus, data?: str, type?: UComponentType, offset?: num) => void
export type InitialData = { data: str; type: UComponentType }
export type BlockInfo = { type: UComponentType; data: str; offset: num; typesStrike?: num }

export type SetUBlockType = (type: UComponentType, data?: str, focus?: FocusType) => void
type NavigationFn = (xOffset?: num) => void
export type ArrowNavigation = { up: NavigationFn; down: NavigationFn }

export type FocusType = 'start' | 'start-integer' | 'end' | 'end-integer'
export type UTextFocus = { type: FocusType; xOffset?: num }

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'text'],
  ['/heading1', 'heading1'],
  ['/heading2', 'heading2'],
  ['/heading3', 'heading3'],
  ['/input', 'input'],
  ['/checks', 'checks'],
  ['/radio', 'radio'],
  ['/textarea', 'textarea'],
  ['/page', 'page'],
  ['*', 'bullet-list'],
  ['1.', 'numbered-list'],
])
