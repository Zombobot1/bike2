import React, { FC } from 'react';
import { ValidatedInputFieldP } from '../types';
import { ValueUpdate } from '../../../utils/types';

export type ValidationF<T> = (d: T) => string;

export type StateT<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type StrStateT = StateT<string>;
export type BoolStateT = StateT<boolean>;

export interface WithValidationBaseP<T> {
  error: StrStateT;
  activation: BoolStateT;
  value: StateT<T>;
}

export interface WithValidationP<T> extends WithValidationBaseP<T> {
  validator: ValidationF<T>;
}

export type ValidatedInputFC<T> = FC<ValidatedInputFieldP<T>>;
export const withValidation = <T,>(Base: ValidatedInputFC<T>) => (props: WithValidationP<T>) => {
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
