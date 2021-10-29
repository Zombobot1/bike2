import { RefObject, useEffect, useRef, useState } from 'react'

export function useHover<T extends HTMLElement = HTMLDivElement>(elementRef?: RefObject<T>) {
  const newRef = useRef(null)
  const ref = elementRef || newRef
  const [value, setValue] = useState<boolean>(false)

  const handleMouseEnter = () => setValue(true)
  const handleMouseLeave = () => setValue(false)

  useEffect(() => {
    const node = ref?.current

    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [ref])

  return { hovered: value, ref }
}
