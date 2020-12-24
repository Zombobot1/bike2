import React, { ChangeEvent, FC } from 'react';
import { ValidatedInputFieldP } from '../types';

type ValidationF = (d: string) => string;

type StateT<T> = [T, React.Dispatch<React.SetStateAction<T>>];
type StrStateT = StateT<string>;
type BoolStateT = StateT<boolean>;

type WithValidationP = {
  error: StrStateT;
  activation: BoolStateT;
};

type ValidatedInputFC = FC<ValidatedInputFieldP>;
const withValidation = (validator: ValidationF) => (Base: ValidatedInputFC) => (props: WithValidationP) => {
  const [errorStr, setErrorStr] = props.error;
  const [wasActivated, setWasActivated] = props.activation;
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWasActivated((p) => Boolean(value || p));
    setErrorStr(validator(value));
  };
  const state = () => {
    if (!wasActivated) return '';
    if (errorStr) return ' is-invalid';
    return ' is-valid';
  };
  const p = { state, onChange, errorStr };
  return <Base {...p} />;
};

export { withValidation };
export type { WithValidationP };
