import React, { ChangeEvent, FC } from 'react';
import { ValidatedInputFieldP } from '../types';
import { ValueUpdate } from '../../../utils/types';

type ValidationF<T> = (d: T) => string;

type StateT<T> = [T, React.Dispatch<React.SetStateAction<T>>];
type StrStateT = StateT<string>;
type BoolStateT = StateT<boolean>;

type WithValidationP<T> = {
  validator: ValidationF<T>;
  error: StrStateT;
  activation: BoolStateT;
  value: StateT<T>;
};

type ValidatedInputFC<T> = FC<ValidatedInputFieldP<T>>;
const withValidation = <T extends unknown>(Base: ValidatedInputFC<T>) => (props: WithValidationP<T>) => {
  const [errorStr, setErrorStr] = props.error;
  const [wasActivated, setWasActivated] = props.activation;
  const [value, setValue] = props.value;
  const onChange = (e: ValueUpdate<T>) => {
    const newValue = e.target.value;
    setWasActivated((p) => Boolean(newValue || p));
    setErrorStr(props.validator(newValue as T));
    setValue(newValue as T);
  };
  const state = () => {
    if (!wasActivated) return '';
    if (errorStr) return ' is-invalid';
    return ' is-valid';
  };
  const p = { state, onChange, errorStr, value };
  return <Base {...p} />;
};

export { withValidation };
export type { ValidationF, WithValidationP, ValidatedInputFC };
