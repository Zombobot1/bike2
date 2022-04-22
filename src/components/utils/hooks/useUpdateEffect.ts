import { deepEqual } from 'fast-equals'
import { useEffect, useRef } from 'react'
import { Fn } from '../../../utils/types'

export default function useUpdateEffect(callback: Fn, dependencies: unknown[]) {
  const firstRenderRef = useRef(dependencies) // it was just a flag, however it didn't survive hmr

  useEffect(() => {
    if (deepEqual(dependencies, firstRenderRef.current)) return
    firstRenderRef.current = dependencies
    return callback()
  }, dependencies)
}
