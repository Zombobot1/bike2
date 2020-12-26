import { preventAndCall } from '../../utils/events';

export interface InputControl {
  emptyActivation: () => void;
  isValid: () => boolean;
}

export const activateAll = (inputs: InputControl[]) => inputs.map((i) => i.emptyActivation());

export const submit = (inputs: InputControl[]) => preventAndCall(() => inputs.map((i) => i.emptyActivation()));
