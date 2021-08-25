import { Fn, State } from '../../../utils/types'
import { useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { useReducer } from 'react'

export const useToggle = (init: boolean) => useReducer((prev) => !prev, init)

export const useMount = (f: Fn) => useEffect(f, [])
export const useUnmount = (f: Fn) => useEffect(() => f, [])
export const useLog = <T>(state: T) => useEffect(() => console.info(state), [state])

export const useEffectedState = <T>(init: T): State<T> => {
  const [state, setState] = useState(init)
  useEffect(() => setState(init), [init])
  return [state, setState]
}

export function useIsSM() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'))
}
