import { InputConfigurationBase } from '../input-field';
import { ValidatedInputFieldP } from '../types';
import React from 'react';

const CheckBoxField = ({ label, id }: InputConfigurationBase) => ({
  state,
  onChange,
  errorStr,
  value,
}: ValidatedInputFieldP<boolean>) => {
  const onClick = () => onChange({ target: { value: !value } });
  return (
    <div className="form-check mt-4">
      <input className={'form-check-input' + state()} type="checkbox" onClick={onClick} id={id} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      <div className="invalid-feedback">{errorStr}</div>
    </div>
  );
};

export default CheckBoxField;
