import { ClassNamesFn, ClassValue } from 'classnames/types';
import classNames from 'classnames';
import { JSObject } from './types';

export const cn: ClassNamesFn = (...classes: ClassValue[]) => classNames(...classes);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pcn = (main: string, ..._classes: any) => {
  let hasTruthy = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectWithMain = (e: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(e).map(([key, value]: [string, any]) => {
      hasTruthy = hasTruthy || value;
      return { [main + key]: value };
    });
  return classNames(..._classes.map(connectWithMain), { [main]: !hasTruthy });
};

export const rnd = (max: number) => Math.floor(Math.random() * max);

// eslint-disable-next-line @typescript-eslint/ban-types
export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) return <T>(arg: T) => arg;
  if (funcs.length === 1) return funcs[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

export const capitalizeOnlyFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const idfy = (route: string, id: string) => `${route.split(':')[0]}${id}`;

export const queryfy = (route: string, args: JSObject) => {
  let result = `${route}?`;
  Object.entries(args).forEach(([k, v]) => {
    result += `${k}=${v}&`;
  });
  return result;
};

export const safe = <T>(o: T | undefined, error = 'Object is not safe'): T => {
  if (!o) throw Error(error);
  return o;
};

export const getIds = () => {
  let _id = '-1';
  return () => {
    _id = String(+_id + 1);
    return _id;
  };
};

export const removeElement = <T>(arr: T[], index: number) => arr.filter((_e, i) => i !== index);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchError = (e: any) => {
  throw new Error(e);
};
