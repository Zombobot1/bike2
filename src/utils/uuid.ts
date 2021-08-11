import { v4 } from 'uuid'
import { str } from './types'

export const uuid = (): str => v4()
export function* uuidS() {
  let i = 0
  while (true) yield String(i++)
}
