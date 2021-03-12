import { StateT } from '../../forms/hoc/with-validation';
import { useEffect, useState } from 'react';

export const useEffectedState = <T>(init: T): StateT<T> => {
  const [state, setState] = useState(init);
  useEffect(() => setState(init), [init]);
  return [state, setState];
};
