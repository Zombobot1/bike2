import { useEffect, useRef, SyntheticEvent, RefObject } from 'react'
import { Fn } from '../../../utils/types'

// introduced to avoid [dependency] for useEventListener
function _useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap,
  handler: (event: Event) => void,
  ref?: RefObject<T>,
) {
  const savedHandler = useRef<(event: Event) => void>()

  useEffect(() => {
    const target: T | Window = ref?.current || window
    if (!(target && target.addEventListener)) return
    if (savedHandler.current !== handler) savedHandler.current = handler

    const eventListener = (event: Event) => {
      if (savedHandler?.current) savedHandler.current(event)
    }

    target.addEventListener(eventName, eventListener)
    return () => target.removeEventListener(eventName, eventListener)
  }, [eventName, ref, handler])
}

export const useEventListener = <T extends Event | SyntheticEvent>(
  eventName: keyof WindowEventMap,
  handler: (e: T) => void,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null)
  _useEventListener(eventName, handler as (e: Event) => void, ref)
  return ref
}
