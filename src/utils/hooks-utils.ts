import { Fn, StateT } from './types';
import { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';

export const useMount = (f: Fn) => useEffect(f, []);

export const useEffectedState = <T>(init: T): StateT<T> => {
  const [state, setState] = useState(init);
  useEffect(() => setState(init), [init]);
  return [state, setState];
};

// React Query returns cached value and then actual
export const useRQState = useEffectedState;

const isDocumentHidden = (): boolean => !document['hidden'];

export const useIsPageVisible = () => {
  const [isVisible, setIsVisible] = useState(isDocumentHidden());
  const onVisibilityChange = () => setIsVisible(isDocumentHidden());

  useEffect(() => {
    const visibilityChange = 'visibilitychange';
    document.addEventListener(visibilityChange, onVisibilityChange, false);
    return () => document.removeEventListener(visibilityChange, onVisibilityChange);
  }, []);

  return isVisible;
};

export function useIsSM() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm'));
}
