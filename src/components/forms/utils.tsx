import { preventAndCall } from '../../utils/events';

export interface InputControl {
  emptyActivation: () => void;
}

export const submit = (inputs: InputControl[]) => preventAndCall(() => inputs.map((i) => i.emptyActivation()));
