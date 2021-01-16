import { ClassNamesFn, ClassValue } from 'classnames/types';
import classNames from 'classnames';
import { varName } from './objects';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cne = (enumKeyAndValue: any, enum_: any) => {
  const classBase = varName(enumKeyAndValue);
  const enumValueName = enum_[enumKeyAndValue[classBase]];
  return `${classBase}--${enumValueName}`.toLowerCase();
};

export const rnd = (max: number) => Math.floor(Math.random() * max);
