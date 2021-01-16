import { useState } from 'react';
import { useGlobalEventListener } from '../utils/hooks/use-event-listener';

export const useCurrentWidth = (widths: number[]) => {
  const selectClosestWidth = () => {
    const min = Math.min(...widths);
    return widths.find((e) => e <= window.innerWidth) || min;
  };
  const [cw, scw] = useState<number>(selectClosestWidth());
  useGlobalEventListener('resize', () => scw(selectClosestWidth()));
  return cw;
};
