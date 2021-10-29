import { useState } from 'react'
import { safe } from '../../../utils/utils'
import { useMount } from './hooks'

export function useOnScreen(ref: React.RefObject<HTMLLIElement>) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), { threshold: 0.5 })

  useMount(() => {
    observer.observe(safe(ref.current))
    return () => observer.disconnect()
  })

  return isIntersecting
}
