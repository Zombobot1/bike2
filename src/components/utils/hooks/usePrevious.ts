import { useEffect, useRef, useState } from 'react'
import { useC } from './hooks'

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current as T
}

// while rendering equals to usePrevious, made for usage in useC. WARNING: NOT REACT STYLE! USE FOR FIREBASE ONLY
export function useCurrent<T>(value: T): () => T {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return useC(() => ref.current as T)
}

// WARNING: NOT REACT STYLE! USE FOR FIREBASE ONLY
export function useCurrentState<T>(init: T): [() => T, (n: T) => void] {
  const [_, ss] = useState(init)
  const ref = useRef<T>(init)

  const set = useC((new_: T) => {
    ref.current = new_
    ss(new_)
  })

  const get = useC(() => ref.current as T)

  return [get, set]
}
