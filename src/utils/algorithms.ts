import _ from 'lodash'
import { num, str } from './types'

export const transformedMax = <T>(arr: T[], f: (v: T) => number): number => Math.max(...arr.map(f))
export const min = <T>(arr: T[], f: (v: T) => number): T => arr.reduce((p, c) => (f(p) - f(c) < 0 ? p : c))
export const max = <T>(arr: T[], f: (v: T) => number): T => arr.reduce((p, c) => (f(p) - f(c) > 0 ? p : c))

export const sum = <T>(arr: T[], f: (p: number, v: T) => number): number => arr.reduce(f, 0)
export const avg = <T>(arr: T[], f: (p: number, v: T) => number): number => arr.reduce(f, 0) / arr.length

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

export const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const zip2 = <T, D>(arr1: T[], arr2: D[]): [T, D][] => {
  const minLength = Math.min(arr1.length, arr2.length)
  const result: [T, D][] = []
  for (let i = 0; i < minLength; i += 1) result.push([arr1[i], arr2[i]])
  return result
}

export const reverse = <T>(array: T[]): T[] => array.map((_, idx) => array[array.length - 1 - idx])
export const insert = (s: str, i: num, data: str): str => s.slice(0, i) + data + s.slice(i)
export function cutData(s: str, start: num, dataOrEnd: str | num): str {
  if (_.isString(dataOrEnd)) return s.slice(0, start) + s.slice(start + dataOrEnd.length)
  return s.slice(0, start) + s.slice(dataOrEnd)
}
