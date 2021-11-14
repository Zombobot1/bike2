import { useCallback, useEffect, useRef, useState } from 'react'
import { bool } from '../../../utils/types'
import { safe } from '../../../utils/utils'

export function useElementSize<T extends HTMLElement = HTMLDivElement>({ passive }: { passive?: bool } = {}) {
  const ref = useRef<T>(null)
  const [size, setSize] = useState(new Size())
  const [ob] = useState(new ResizeObserver((e) => setSize((old) => ({ ...old, width: e[0].contentRect.width })))) // anomaly: incorrect width without observing

  const updateSize = useCallback(() => {
    const node = ref?.current
    if (node) {
      setSize({
        width: node.offsetWidth || 0,
        height: node.offsetHeight || 0,
      })
    }
  }, [ref])

  useEffect(() => {
    if (passive) return
    updateSize()
    ob.observe(safe(ref?.current))
    return () => ob.disconnect()
  }, [passive]) // cypress anomaly: observer throws in UText latex editing

  return { ref, ...size }
}

export function useClientRect() {
  const [rect, setRect] = useState(null)
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])
  return [rect, ref]
}

class Size {
  width = 0
  height = 0
}
