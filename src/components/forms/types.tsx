import { OnChange } from '../../utils/types';

type ValidatedInputFieldP = {
  state: () => string;
  onChange: OnChange;
  errorStr: string;
};

export type { ValidatedInputFieldP };
