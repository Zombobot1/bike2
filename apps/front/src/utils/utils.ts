import { Fn, JSObject } from './types'
import { styled } from '@material-ui/core'

type E = {
  preventDefault: Fn
  stopPropagation: Fn
}

export function prevented(f: () => void) {
  return (e: E) => {
    e.preventDefault()
    e.stopPropagation()
    f()
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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

export const safe = <T>(o?: T, error = 'Object is not safe'): T => {
  if (!o) throw Error(error)
  return o
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