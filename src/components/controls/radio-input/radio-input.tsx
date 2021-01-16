import React from 'react';
import RadioButton from '../radio-button';
import { useSateWithOnChange } from '../../utils/hooks/use-state-with-onchange';

export interface RadioOption {
  id: string;
  label: string;
}

export interface RadioInputP {
  name: string;
  options: RadioOption[];
  onChange: (current: string, prev: string) => void;
}

const RadioInput = ({ name, options, onChange }: RadioInputP) => {
  const activeValue = useSateWithOnChange(onChange);
  return (
    <>
      {options.map((e, i) => (
        <RadioButton id={e.id} name={name} label={e.label} activeValue={activeValue} key={i} />
      ))}
    </>
  );
};

export default RadioInput;
