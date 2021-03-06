import { useState } from 'react'
import { insertAt, replaceAt } from '../../../utils/algorithms'
import { bool, num, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'

export interface UArray<T> {
  _data: T[] // readonly

  map: <D>(f: (e: T) => D, i?: num) => D[]
  filter: (f: (e: T) => bool, i?: num) => T[]
  find: (f: (e: T) => bool, i?: num) => T | undefined

  has: (f: (e: T) => bool, i?: num) => bool
  get: (f: (e: T) => bool, i?: num) => T

  push: (e: T) => void
  insert: (e: T, i: num) => void
  replace: (e: T, i: num) => void

  delete: (i: num) => void
  deleteElement: (e: T) => void

  reset: (newData: T[]) => void
  clear: () => void
}

export function useArray<T = str>(init: T[] = []): UArray<T> {
  const [array, setArray] = useState(init)

  return {
    _data: array, // readonly

    map: <D>(f: (e: T) => D, i?: num) => array.map(f, i),
    filter: (f: (e: T) => bool, i?: num) => array.filter(f, i),
    find: (f: (e: T) => bool, i?: num) => array.find(f, i),

    has: (f: (e: T) => bool, i?: num) => Boolean(array.find(f, i)),
    get: (f: (e: T) => bool, i?: num) => safe(array.find(f, i)),
    reset: (newData: T[]) => setArray(newData),

    push: (e: T) => setArray((a) => [...a, e]),
    insert: (e: T, i: num) => setArray((a) => insertAt(a, i, e)),
    replace: (e: T, i: num) => setArray((a) => replaceAt(a, e, i)),

    delete: (i: num) => setArray((a) => [...a.slice(0, i), ...a.slice(i + 1, a.length - 1)]),
    deleteElement: (e: T) => setArray((a) => a.filter((element) => element !== e)),
    clear: () => setArray([]),
  }
}

export type UArrayStr = UArray<str>
