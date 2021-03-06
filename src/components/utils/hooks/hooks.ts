import { bool, Fn, num, SetBool, State } from '../../../utils/types'
import { useCallback, useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'

export function useToggle(init = false): [bool, Fn, SetBool] {
  const [value, setValue] = useState(init)
  return [value, () => setValue((currentValue) => !currentValue), setValue]
}

export function useLocalTrigger(): [num, Fn] {
  const [value, setValue] = useState(0)
  return [value, () => setValue((old) => old + 1)]
}

export const useMount = (f: Fn) => useEffect(f, [])
export const useUnmount = (f: Fn) => useEffect(() => f, [])
export const useLog = <T>(state: T, tip = '') => useEffect(() => console.info(tip, state), [state])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useC = <T extends (...args: any[]) => any>(fn: T, deps = []): T => useCallback(fn, deps)

export const useReactive = <T>(init: T): State<T> => {
  const [state, setState] = useState(init)
  useEffect(() => setState(init), [init])
  return [state, setState]
}

export const useReactiveObject = <T>(init: T): State<T> => {
  const [state, setState] = useState(init)
  useEffect(() => setState(init), [JSON.stringify(init)])
  return [state, setState]
}

export function useIsSM() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true }) // WARNING: IF SSR IS TURNED ON IT WILL UNMOUNT UBLOCKS (critical for images)
}
