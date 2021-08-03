import { str } from '../../utils/types'

type EditableText = 'TEXT' | 'HEADING1' | 'HEADING2' | 'HEADING3'
export type UComponentType = EditableText | 'PROJECTION'

export type StrBlockPostResponseDTO = { _id: str }
export type StrBlockPostDTO = { type: UComponentType }
export type StrBlockPutDTO = { type: UComponentType; data: str }
export type StrBlockGetDTO = StrBlockPutDTO

export interface StrBlockComponent {
  data: str
  setData: (d: str) => void
}

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'TEXT'],
  ['/heading1', 'HEADING1'],
  ['/heading2', 'HEADING2'],
  ['/heading3', 'HEADING3'],
])
