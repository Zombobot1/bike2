import { StrStateT } from '../../forms/hoc/with-validation';
import React from 'react';

export interface RadioButtonP {
  id: string;
  name: string;
  label: string;
  activeValue: StrStateT;
}

const RadioButton = ({ id, label, name, activeValue }: RadioButtonP) => {
  const [active, setActive] = activeValue;

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        id={id}
        checked={id === active}
        onChange={() => setActive(id)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
