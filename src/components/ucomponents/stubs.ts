import { str } from '../../utils/types'
import { StrBlockGetDTO } from './types'

export const blocksS = new Map<str, StrBlockGetDTO>([
  ['data1', { type: 'TEXT', data: 'initial data' }],
  ['file data2', { type: 'FILE', data: 'http://uni.com/static/name-uuid.pdf' }],
])
