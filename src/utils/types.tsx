export type Scroller = {
  scrollFrom: (name: string) => void;
};

export type ValueUpdate<T> = { target: { value: T } };
export type OnChange<T> = (e: ValueUpdate<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSObject = { [key: string]: any };

export type Fn = () => void;
export const fn: Fn = () => {
  // console.info(currentState);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instantiable = { new (...args: any[]): any };
export interface WithId {
  _id: string;
}
