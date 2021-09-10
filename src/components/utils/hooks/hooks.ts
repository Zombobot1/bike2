import { Fn, State } from '../../../utils/types'
import { useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { useReducer } from 'react'

export const useToggle = (init = false) => useReducer((prev) => !prev, init)

export const useMount = (f: Fn) => useEffect(f, [])
export const useUnmount = (f: Fn) => useEffect(() => f, [])
export const useLog = <T>(state: T) => useEffect(() => console.info(state), [state])

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
