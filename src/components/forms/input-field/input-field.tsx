import { ValidatedInputFieldP } from '../types';
import React from 'react';

type InputConfiguration = {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  icon: string;
};

const InputField = (config: InputConfiguration) => ({ state, onChange, errorStr }: ValidatedInputFieldP) => {
  const { id, label, placeholder, type, icon } = config;
  return (
    <div className="form-group email-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-icon">
        <img src={icon} alt="i" className={`e-${type}`} />
        <input type={type} className={'form-control' + state()} id={id} placeholder={placeholder} onChange={onChange} />
        <div className="invalid-feedback">{errorStr}</div>
      </div>
    </div>
  );
};

export default InputField;
export type { InputConfiguration };
