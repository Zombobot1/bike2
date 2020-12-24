import { ValidatedInputFieldP } from '../types';
import React from 'react';

interface InputConfigurationBase {
  label: string;
  id: string;
}

interface InputConfiguration extends InputConfigurationBase {
  placeholder: string;
  type: string;
  icon: string;
}
type InputFieldP = ValidatedInputFieldP<string>;
const InputField = (config: InputConfiguration) => ({ state, onChange, errorStr, value }: InputFieldP) => {
  const { id, label, placeholder, type, icon } = config;
  return (
    <div className={`form-group ${type}-group`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-with-icon">
        <img className={`e-${type}`} src={icon} alt="i" />
        <input
          className={'form-control' + state()}
          type={type}
          value={value}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className="invalid-feedback">{errorStr}</div>
      </div>
    </div>
  );
};

export default InputField;
export type { InputConfiguration, InputConfigurationBase };
