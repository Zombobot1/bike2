import { ChangeEvent } from 'react';

type Scroller = {
  scrollFrom: (name: string) => void;
};

export type { Scroller };
export type ValueUpdate<T> = { target: { value: T } };
export type OnChange<T> = (e: ValueUpdate<T>) => void;
export type RFC<T = Record<string, never>> = (props: T) => JSX.Element;
