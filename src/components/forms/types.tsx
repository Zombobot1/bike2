import { OnChange } from '../../utils/types';

export type ValidatedInputFieldP<T> = {
  state: () => string;
  onChange: OnChange<T>;
  errorStr: string;
  value: T;
};
