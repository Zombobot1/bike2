import { useState } from 'react'
import { bool, num } from '../../../utils/types'
import { safe } from '../../../utils/utils'

export function useArray<T>(init: T[] = []) {
  const [array, setArray] = useState(init)

  return {
    map: <D>(f: (e: T) => D, i?: num) => array.map(f, i),
    filter: (f: (e: T) => bool, i?: num) => array.filter(f, i),
    find: (f: (e: T) => bool, i?: num) => array.find(f, i),

    has: (f: (e: T) => bool, i?: num) => Boolean(array.find(f, i)),
    get: (f: (e: T) => bool, i?: num) => safe(array.find(f, i)),
    reset: (newData: T[]) => setArray(newData),

    push: (e: T) => setArray((a) => [...a, e]),
    insert: (e: T, i: num) => setArray((a) => [...a.slice(0, i), e, ...a.slice(i + 1, a.length - 1)]),
    delete: (i: num) => setArray((a) => [...a.slice(0, i), ...a.slice(i + 1, a.length - 1)]),
    clear: () => setArray([]),
  }
}
