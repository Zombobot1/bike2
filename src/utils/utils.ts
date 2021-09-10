import { Fn, JSObject, num, str } from './types'
import { styled } from '@material-ui/core'

type E = {
  preventDefault: Fn
  stopPropagation: Fn
}

export function prevented(f: Fn) {
  return (e: E) => {
    e.preventDefault()
    e.stopPropagation()
    f()
  }
}

export const prevent = (e: E) => e.preventDefault()
export const combine = (f1: Fn, f2: Fn) => () => {
  f1()
  f2()
}

export function cast<T>(data: str, default_: T): T {
  if (!data) return default_

  try {
    return JSON.parse(data) as T
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

export const safe = <T>(o?: T, error = 'Object is not safe'): Exclude<T, null> => {
  if (!o) throw Error(error)
  return o as Exclude<T, null>
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

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function getEmptyStrings(len: number) {
  const result = []
  for (let i = 0; i < len; i++) result.push('')
  return result
}

export const cut = (string: str, length: num) => (string.length <= length ? string : string.slice(0, length) + '...')
