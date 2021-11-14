import { bool, Fn, SetBool, State } from '../../../utils/types'
import { useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'

export function useToggle(init = false): [bool, Fn, SetBool] {
  const [value, setValue] = useState(init)
  return [value, () => setValue((currentValue) => !currentValue), setValue]
}

export const useMount = (f: Fn) => useEffect(f, [])
export const useUnmount = (f: Fn) => useEffect(() => f, [])
export const useLog = <T>(state: T, tip = '') => useEffect(() => console.info(tip, state), [state])

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
  return useMediaQuery(theme.breakpoints.up('sm'))
}
