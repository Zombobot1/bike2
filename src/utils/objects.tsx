// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setField<O>(obj: O, key: keyof any, value: any) {
  if (!hasKey(obj, key)) throw Error(`no ${String(key)} in ${obj}`);

  obj[key] = value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function map(obj: any, functor: (key: string, value: any) => any) {
  if (obj) return [];
  return Object.entries(obj).map(([key, value]) => functor(key, value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const varName = (var_: any) => Object.keys(var_)[0];
