import { ChangeEvent } from 'react';

type Scroller = {
  scrollFrom: (name: string) => void;
};

export type { Scroller };
export type OnChange = (e: ChangeEvent<HTMLInputElement>) => void;
export type RFC<T = Record<string, never>> = (props: T) => JSX.Element;
