import { ClassNamesFn, ClassValue } from 'classnames/types';
import classNames from 'classnames';
import { varName } from './objects';

export const cn: ClassNamesFn = (...classes: ClassValue[]) => classNames(...classes);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cne = (enumKeyAndValue: any, enum_: any) => {
  const classBase = varName(enumKeyAndValue);
  const enumValueName = enum_[enumKeyAndValue[classBase]];
  return `${classBase}--${enumValueName}`.toLowerCase();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformedMax = (arr: any, f: any) => Math.max(...arr.map(f));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sum = (arr: any, f: any) => arr.reduce(f, 0);
