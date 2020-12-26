import { InputConfigurationBase } from '../input-field';
import { ValidatedInputFieldP } from '../types';
import React from 'react';

interface TextAreaConfiguration extends InputConfigurationBase {
  rows: number;
}

type TextAreaP = ValidatedInputFieldP<string>;
const TextAreaField = (config: TextAreaConfiguration) => ({ state, onChange, errorStr, value }: TextAreaP) => {
  const { id, label, rows } = config;
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <textarea className={'form-control' + state()} id={id} rows={rows} onChange={onChange} value={value} />
      <div className="invalid-feedback">{errorStr}</div>
    </div>
  );
};

export default TextAreaField;
