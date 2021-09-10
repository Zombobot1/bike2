import { DependencyList, useCallback, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRefCallback<T extends any[]>(
  value: ((...args: T) => void) | undefined,
  deps?: DependencyList,
): (...args: T) => void {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, deps ?? [value])

  const result = useCallback((...args: T) => {
    ref.current?.(...args)
  }, [])

  return result
}
