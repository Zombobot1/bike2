import { bool, num, str } from '../../utils/types'

export type UListComponent = 'LIST' | 'BULLET_LIST' | 'NUMBERED_LIST'
export type UTextComponent = 'TEXT' | 'HEADING1' | 'HEADING2' | 'HEADING3' | 'HEADING0' | UListComponent
export type UFileComponent = 'FILE' | 'IMAGE' | 'AUDIO'
export type UFormBlockComponent = 'RADIO' | 'INPUT' | 'CHECKS' | 'TEXTAREA'
export type UFormComponent = 'TEST' | 'EXERCISE' | 'QUESTION'
export type UProjectionComponent = 'PAGE' | UFormComponent
export type UComponentType = UTextComponent | UFileComponent | UFormBlockComponent | UProjectionComponent

export function isUTextComponent(t?: UComponentType): bool {
  if (!t) return false
  const types: UComponentType[] = [
    'TEXT',
    'HEADING1',
    'HEADING2',
    'HEADING3',
    'HEADING0',
    'LIST',
    'BULLET_LIST',
    'NUMBERED_LIST',
  ]
  return types.includes(t)
}

export function isUListComponent(t?: UComponentType): bool {
  if (!t) return false
  const types: UComponentType[] = ['LIST', 'BULLET_LIST', 'NUMBERED_LIST']
  return types.includes(t)
}

export function isUFormComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['RADIO', 'INPUT', 'CHECKS', 'TEXTAREA']
  return types.includes(t)
}

export function isUFileComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['FILE', 'IMAGE', 'AUDIO']
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

export type NewBlockFocus = 'FOCUS_START' | 'FOCUS_END' | 'NO_FOCUS'
export type AddNewBlockUText = (focus?: NewBlockFocus, data?: str, type?: UComponentType, offset?: num) => void
export type InitialData = { data: str; type: UComponentType }
export type BlockInfo = { type: UComponentType; data: str; offset: num; typesStrike?: num }

export type SetUBlockType = (type: UComponentType, data?: str, focus?: FocusType) => void
type NavigationFn = (xOffset?: num) => void
export type ArrowNavigation = { up: NavigationFn; down: NavigationFn }

export type FocusType = 'start' | 'start-integer' | 'end' | 'end-integer'
export type UTextFocus = { type: FocusType; xOffset?: num }

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'TEXT'],
  ['/heading1', 'HEADING1'],
  ['/heading2', 'HEADING2'],
  ['/heading3', 'HEADING3'],
  ['/input', 'INPUT'],
  ['/checks', 'CHECKS'],
  ['/radio', 'RADIO'],
  ['/textarea', 'TEXTAREA'],
  ['/page', 'PAGE'],
  ['*', 'BULLET_LIST'],
  ['1.', 'NUMBERED_LIST'],
])
