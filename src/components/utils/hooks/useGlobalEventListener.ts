import { str } from '../../../utils/types'
import { useMount } from './hooks'

export function useGlobalEventListener(event: str, handler: (e: Event) => void) {
  useMount(() => {
    window.addEventListener(event, handler)
  })

  return () => window.removeEventListener(event, handler)
}
