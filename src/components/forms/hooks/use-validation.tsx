import { ValidationF } from '../hoc/with-validation';
import { useState } from 'react';

const useValidation = <T,>(name: string, validator: ValidationF<T>, initial: T) => {
  const value = useState(initial);
  const error = useState('');
  const activation = useState(false);
  const emptyActivation = () => {
    if (activation[0]) return;
    activation[1](true);
    error[1](`Enter ${name}`);
  };

  return { value, error, activation, emptyActivation, validator };
};

export const useStrInput = (name: string, validator: ValidationF<string>) => useValidation<string>(name, validator, '');
export const useBoolInput = (name: string, validator: ValidationF<boolean>) =>
  useValidation<boolean>(name, validator, false);
