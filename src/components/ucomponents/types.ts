import { str } from '../../utils/types'

export type UComponentType = 'TEXT' | 'Heading1' | 'Heading2' | 'Heading3'

export const regexAndType = new Map<str, UComponentType>([
  ['/text', 'TEXT'],
  ['/heading1', 'Heading1'],
  ['/heading2', 'Heading2'],
  ['/heading3', 'Heading3'],
])
