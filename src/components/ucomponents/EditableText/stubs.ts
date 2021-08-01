import { str } from '../../../utils/types'
import { StrBlockGetDTO } from '../types'

export const blocksS = new Map<str, StrBlockGetDTO>([['data1', { type: 'TEXT', data: 'initial data' }]])

export function foo() {
    throw new Error('aefhseaufn')
  }
