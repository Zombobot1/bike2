import { nanoid } from 'nanoid'
import { num, str } from '../types'

export const uuid = ({ short = false } = {}) => {
  return nanoid(short ? 6 : 21)
}

function* _uuidS(i: num) {
  while (true) yield String(i++)
}

export function uuidS(i = 0): () => str {
  const g = _uuidS(i)
  return () => g.next().value || ''
}
