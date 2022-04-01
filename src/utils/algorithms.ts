import _ from 'lodash'
import { isCypress } from '../components/utils/hooks/isCypress'
import { num, str } from './types'
import { safe } from './utils'

export const transformedMax = <T>(arr: T[], f: (v: T) => num): num => Math.max(...arr.map(f))
export const min = <T>(arr: T[], f: (v: T) => num): T => arr.reduce((p, c) => (f(p) - f(c) < 0 ? p : c))
export const max = <T>(arr: T[], f: (v: T) => num): T => arr.reduce((p, c) => (f(p) - f(c) > 0 ? p : c))

export const sum = <T>(arr: T[], f: (p: num, v: T) => num = _sum): num => arr.reduce(f, 0)
export const avg = <T>(arr: T[], f: (p: num, v: T) => num = _sum): num => arr.reduce(f, 0) / arr.length

export const gen = <T = num>(length: num, f: (i: num) => T = (i) => i as unknown as T): T[] =>
  Array(length)
    .fill(undefined)
    .map((_, i) => f(i))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _sum = (p: num, v: any): num => p + v

export const uclamp = (value: num, min: num, max: num) => Math.min(Math.max(value, min), max)

export const safeSplit = (str: string, sep: string | RegExp) => {
  const parts = str.split(sep)
  return parts.map((s) => s.trim()).filter((e) => e)
}

export const findAll = (str: string, regex: RegExp): string[] => {
  const result: string[] = []

  let m = null
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++ // This is necessary to avoid infinite loops with zero-width matches
    m.forEach((match) => result.push(match))
  }

  return result
}

export const ushuffle = <T>(arr: T[]): T[] => {
  if (isCypress.isCypress) return [...arr]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return [...arr]
}

export const zip2 = <T, D>(arr1: T[], arr2: D[]): [T, D][] => {
  const minLength = Math.min(arr1.length, arr2.length)
  const result: [T, D][] = []
  for (let i = 0; i < minLength; i += 1) result.push([arr1[i], arr2[i]])
  return result
}

export const reverse = <T>(array: T[]): T[] => array.map((_, idx) => array[array.length - 1 - idx])
export const replace = <T>(array: T[], replaceData: T, ...newData: T[]): T[] => {
  const i = array.indexOf(replaceData)
  return [...array.slice(0, i), ...newData, ...array.slice(i + 1)]
}
export const remove = <T>(array: T[], data: T): T[] => array.filter((d) => d !== data)
export const push = <T>(array: T[], data: T): T[] => [...array, data]

export const insertAt = <T>(array: T[], atI: num, ...data: T[]): T[] => [
  ...array.slice(0, atI),
  ...data,
  ...array.slice(atI),
]
export const replaceAt = <T>(array: T[], data: T, atI: num): T[] => array.map((e, i) => (i === atI ? data : e))
export const removeAt = <T>(array: T[], atI: num): T[] => array.filter((_, i) => i !== atI)

export const insertInStr = (s: str, atI: num, data: str): str => s.slice(0, atI) + data + s.slice(atI)
export const deleteInStr = (s: str, atI: num, length: num): str => s.slice(0, atI) + s.slice(atI + length)

export function mapAppend<K, V>(map: Map<K, V[]>, key: K, data: V): Map<K, V[]> {
  if (!map.has(key)) map.set(key, [data])
  else safe(map.get(key)).push(data)
  return map
}

export const insert = (s: str, i: num, data: str): str => s.slice(0, i) + data + s.slice(i)
export function cutData(s: str, start: num, dataOrEnd: str | num): str {
  if (_.isString(dataOrEnd)) return s.slice(0, start) + s.slice(start + dataOrEnd.length)
  return s.slice(0, start) + s.slice(dataOrEnd)
}

export const sort = <T>(arr: T[], toNum: (element: T) => num = (e) => e as unknown as num): T[] => {
  arr.sort((a, b) => toNum(a) - toNum(b))
  return arr
}
