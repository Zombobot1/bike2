import { styled } from '@mui/material'
import _ from 'lodash'
import { bool, f, Fn, JSObject, num, str, strs } from './types'

type E = {
  preventDefault: Fn
  stopPropagation: Fn
  nativeEvent: {
    stopImmediatePropagation: Fn
  }
}

export function prevented(f: Fn) {
  return (e: E) => {
    prevent(e)
    f()
  }
}

export const prevent = (e: E) => {
  e.preventDefault()
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function all(...fs: Array<Function | undefined>) {
  return (_?: unknown) => {
    fs.forEach((_f) => (_f ? _f() : f()))
  }
}

export function ucast<T>(data: str, default_: T): T {
  if (!data) return default_

  try {
    if (Array.isArray(default_)) return JSON.parse(data) as T
    else return { ...default_, ...JSON.parse(data) } as T
  } catch (error) {
    console.error(error)
  }

  return default_
}

export interface IsSM {
  isSM?: boolean
}

export function sfp(name: string) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shouldForwardProp: (p: any) => p !== name,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rstyled = (component: any) => styled(component, sfp('isSM'))

export const rnd = (max: number) => Math.floor(Math.random() * max)

// eslint-disable-next-line @typescript-eslint/ban-types
export function compose(...funcs: Function[]) {
  if (funcs.length === 0) return <T>(arg: T) => arg
  if (funcs.length === 1) return funcs[0]

  return funcs.reduce(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any) =>
        a(b(...args)),
  )
}

export const capitalizeOnlyFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const queryfy = (route: string, args: JSObject) => {
  let result = `${route}?`
  Object.entries(args).forEach(([k, v]) => {
    result += `${k}=${v}&`
  })
  return result
}

export const safe = <T>(o?: T, hint = ''): Exclude<T, null | undefined> => {
  if (o === undefined || o === null) throw Error(`Object is not safe ${hint}`)
  return o as Exclude<T, null | undefined>
}

export const getIds = () => {
  let _id = '-1'
  return () => {
    _id = String(+_id + 1)
    return _id
  }
}

export const removeElement = <T>(arr: T[], index: number) => arr.filter((_e, i) => i !== index)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchError = (e: any) => {
  throw new Error(e)
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function getEmptyStrings(len: number) {
  const result = []
  for (let i = 0; i < len; i++) result.push('')
  return result
}

export const cut = (string: str, length: num) => (string.length <= length ? string : string.slice(0, length) + '...')

export const mod = (n: num, m: num) => ((n % m) + m) % m

export const isStr = (s: unknown): s is string => _.isString(s)

export const isObjOrArr = (o: unknown): bool => typeof o === 'object' && o !== null
export const isObj = (o: unknown): bool => typeof o === 'object' && o !== null && !Array.isArray(o)

export const filterProps = (props: JSObject, excessive: strs) =>
  Object.fromEntries(Object.entries(props).filter(([k]) => !excessive.includes(k)))

export function log<State, Action>(f: (s: State, a: Action) => State): (s: State, a: Action) => State {
  return (old: State, a: Action) => {
    const new_ = f(old, a)
    // if (!a.a.includes('mouse')) console.info({ old, action: a, new: new_ })
    console.info({ old, action: a, new: new_ })
    return new_
  }
}
