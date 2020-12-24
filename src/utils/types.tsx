export type Scroller = {
  scrollFrom: (name: string) => void;
};

export type ValueUpdate<T> = { target: { value: T } };
export type OnChange<T> = (e: ValueUpdate<T>) => void;
