import { useEffect, useRef } from 'react'
import { Fn } from '../../../utils/types'

export default function useUpdateEffect(callback: Fn, dependencies: unknown[]) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    return callback()
  }, dependencies)
}
