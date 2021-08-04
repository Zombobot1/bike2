import { bool, str } from '../../utils/types'

type EditableText = 'TEXT' | 'HEADING1' | 'HEADING2' | 'HEADING3'
type File = 'FILE' | 'IMAGE' | 'AUDIO'

export type UComponentType = EditableText | File | 'PROJECTION'

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
