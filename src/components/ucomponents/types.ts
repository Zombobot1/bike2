import { bool, str } from '../../utils/types'

export type UTextComponent = 'TEXT' | 'HEADING1' | 'HEADING2' | 'HEADING3'
export type UFileComponent = 'FILE' | 'IMAGE' | 'AUDIO'
export type UFormBlockComponent = 'RADIO' | 'INPUT' | 'CHECKS' | 'TEXTAREA'
export type UFormComponent = 'TEST' | 'EXERCISE' | 'QUESTION'
export type UProjectionComponent = 'PAGE' | UFormComponent | 'PROJECTION'
export type UComponentType = UTextComponent | UFileComponent | UFormBlockComponent | UProjectionComponent

export function isUFormComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['RADIO', 'INPUT', 'CHECKS', 'TEXTAREA']
  return types.includes(t)
}

export interface UBlockB {
  _id: str
  readonly?: bool
  isEditing?: bool
}

export type UBlockPostDTO = { _id: str; data?: str }
export type UBlockPatchDTO = { type?: UComponentType; data?: str }
export type UBlockGetDTO = { type: UComponentType; data: str }

export type FileUploadRDTO = { data: str }
export interface UBlockComponent {
  data: str
  setData: (d: str) => void
  readonly?: bool
}

export type NewBlockFocus = 'FOCUS' | 'NO_FOCUS'
export type AddNewBlock = (under?: str, focus?: NewBlockFocus, data?: str) => void
export type AddNewBlockUText = (focus?: NewBlockFocus, data?: str) => void

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'TEXT'],
  ['/heading1', 'HEADING1'],
  ['/heading2', 'HEADING2'],
  ['/heading3', 'HEADING3'],
  ['/input', 'INPUT'],
  ['/checks', 'CHECKS'],
  ['/radio', 'RADIO'],
  ['/textarea', 'TEXTAREA'],
])
