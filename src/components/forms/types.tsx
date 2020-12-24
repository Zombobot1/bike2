import { OnChange } from '../../utils/types';

type ValidatedInputFieldP<T> = {
  state: () => string;
  onChange: OnChange<T>;
  errorStr: string;
  value: T;
};

export type { ValidatedInputFieldP };
