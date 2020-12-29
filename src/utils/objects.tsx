// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setField<O>(obj: O, key: keyof any, value: any) {
  if (!hasKey(obj, key)) throw Error(`no ${String(key)} in ${obj}`);

  obj[key] = value;
}

export function map<O, V>(obj: O, functor: (key: string, value: V) => void) {
  if (obj) Object.entries(obj).forEach(([key, value]) => functor(key, value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const varName = (var_: any) => Object.keys(var_)[0];
