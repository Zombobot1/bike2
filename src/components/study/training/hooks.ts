import { atom, useAtom } from 'jotai';
import { Fn, fn } from '../../../utils/types';

const interactiveSubmitAtom = atom({ on: fn });

export const useInteractiveSubmit = () => {
  const [_interactiveSubmit, _setInteractiveSubmit] = useAtom(interactiveSubmitAtom);
  return {
    interactiveSubmit: _interactiveSubmit.on,
    setInteractiveSubmit: (f: Fn) => _setInteractiveSubmit({ on: f }),
  };
};
