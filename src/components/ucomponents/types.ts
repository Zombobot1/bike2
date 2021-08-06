import { bool, str } from '../../utils/types'

export type UTextComponent = 'TEXT' | 'HEADING1' | 'HEADING2' | 'HEADING3'
export type UFileComponent = 'FILE' | 'IMAGE' | 'AUDIO'
export type UFormComponent = 'RADIO' | 'INPUT' | 'CHECKS' | 'TEXTAREA'
export type UComponentType = UTextComponent | UFileComponent | UFormComponent | 'PROJECTION'

export function isUFormComponent(t: UComponentType): bool {
  const types: UComponentType[] = ['RADIO', 'INPUT', 'CHECKS', 'TEXTAREA']
  return types.includes(t)
}

export type StrBlockPostRDTO = { _id: str }
export type StrBlockPostDTO = { type: UComponentType }
export type StrBlockPatchDTO = { type?: UComponentType; data?: str }
export type StrBlockGetDTO = { type: UComponentType; data: str }

export type FileUploadRDTO = { data: str }
export interface StrBlockComponent {
  data: str
  setData: (d: str) => void
  readonly?: bool
}

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'TEXT'],
  ['/heading1', 'HEADING1'],
  ['/heading2', 'HEADING2'],
  ['/heading3', 'HEADING3'],
])
