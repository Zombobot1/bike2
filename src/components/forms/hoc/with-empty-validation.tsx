import { ValidatedInputFC, WithValidationBaseP } from './with-validation';
import { ValueUpdate } from '../../../utils/types';
import React from 'react';

export const withEmptyValidation = <T,>(Base: ValidatedInputFC<T>) => (props: WithValidationBaseP<T>) => {
  const [errorStr, setErrorStr] = props.error;
  const [_, setWasActivated] = props.activation;
  const [value, setValue] = props.value;
  const onChange = (e: ValueUpdate<T>) => {
    const newValue = e.target.value;
    setWasActivated(Boolean(newValue));
    if (newValue) setErrorStr('');
    setValue(newValue as T);
  };
  const state = () => {
    if (!errorStr) return '';
    return ' is-invalid';
  };
  const p = { state, onChange, errorStr, value };
  return <Base {...p} />;
};
