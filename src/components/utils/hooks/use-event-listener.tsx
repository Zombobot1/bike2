import { useEffect, useRef } from 'react';

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

export const useGlobalEventListener = (eventName: string, handler: (e: Event) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const eventListener = (event: Event) => handler(event);
    window.addEventListener(eventName, eventListener);
    return () => window.removeEventListener(eventName, eventListener);
  }, [eventName]);
};