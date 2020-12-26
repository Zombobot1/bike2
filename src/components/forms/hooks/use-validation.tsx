import { ValidationF } from '../hoc/with-validation';
import { useState } from 'react';

const useEmptyValidation = <T,>(name: string, initial: T) => {
  const value = useState(initial);
  const error = useState('');
  const activation = useState(false);
  const emptyActivation = () => {
    if (activation[0]) return;
    activation[1](true);
    error[1](`Enter ${name}`);
  };
  const isValid = () => error[0] === '';

  return { value, error, activation, emptyActivation, isValid };
};

const useValidation = <T,>(name: string, validator: ValidationF<T>, initial: T) => {
  return { ...useEmptyValidation(name, initial), validator };
};

export const useStrInput = (name: string, validator: ValidationF<string>) => useValidation<string>(name, validator, '');
export const useBoolInput = (name: string, validator: ValidationF<boolean>) =>
  useValidation<boolean>(name, validator, false);
export const useNotEmptyStrInput = (name: string) => useEmptyValidation<string>(name, '');
