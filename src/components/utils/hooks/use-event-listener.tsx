import { useEffect, useRef, SyntheticEvent } from 'react'
import { Fn } from '../../../utils/types'

export const useEventListener = <T extends Event | SyntheticEvent, D>(
  eventName: string,
  handler: (e: T) => void,
  dependency?: D,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null)
  useEffect(() => {
    const eventListener = (event: T) => handler(event)
    ref.current.addEventListener(eventName, eventListener)
    return () => ref?.current?.removeEventListener(eventName, eventListener)
  }, [eventName, ref, dependency])
  return ref
}

type EventsAndHandlers<T extends Event> = { event: string; handler: (e: T) => void }[]
type CleanUps = { cleanUp: Fn }[]
export const useEventListeners = <T extends Event>(listeners: EventsAndHandlers<T>, addOneMoreTime = false) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null)
  useEffect(() => {
    const cleanUps: CleanUps = []
    listeners.forEach((l) => {
      const eventListener = (event: T) => l.handler(event)
      ref.current.addEventListener(l.event, eventListener)
      cleanUps.push({ cleanUp: () => ref?.current?.removeEventListener(l.event, eventListener) })
    })

    return () => cleanUps.forEach((c) => c.cleanUp())
  }, [ref, addOneMoreTime])
  return ref
}

export const useGlobalEventListener = (eventName: string, handler: (e: Event) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const eventListener = (event: Event) => handler(event)
    window.addEventListener(eventName, eventListener)
    return () => window.removeEventListener(eventName, eventListener)
  }, [eventName])
}
