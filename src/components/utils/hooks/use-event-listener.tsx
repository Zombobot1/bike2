import { useEffect, useRef } from 'react';
import { Fn } from '../../../utils/types';

export const useEventListener = (eventName: string, handler: (e: Event) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null);
  useEffect(() => {
    const eventListener = (event: Event) => handler(event);
    ref.current.addEventListener(eventName, eventListener);
    return () => ref?.current?.removeEventListener(eventName, eventListener);
  }, [eventName, ref]);
  return ref;
};

type EventsAndHandlers = { event: string; handler: (e: Event) => void }[];
type CleanUps = { cleanUp: Fn }[];
export const useEventListeners = (listeners: EventsAndHandlers) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null);
  useEffect(() => {
    const cleanUps: CleanUps = [];
    listeners.forEach((l) => {
      const eventListener = (event: Event) => l.handler(event);
      ref.current.addEventListener(l.event, eventListener);
      cleanUps.push({ cleanUp: () => ref?.current?.removeEventListener(l.event, eventListener) });
    });

    return () => cleanUps.forEach((c) => c.cleanUp());
  }, [ref]);
  return ref;
};

export const useGlobalEventListener = (eventName: string, handler: (e: Event) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const eventListener = (event: Event) => handler(event);
    window.addEventListener(eventName, eventListener);
    return () => window.removeEventListener(eventName, eventListener);
  }, [eventName]);
};
