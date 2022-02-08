import { v4 } from 'uuid'

export const uuid = () => v4()

function* _uuidS() {
  let i = 0
  while (true) yield String(i++)
}

export function uuidS() {
  const g = _uuidS()
  return () => g.next().value
}
