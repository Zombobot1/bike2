import { sslugify } from '../../../utils/sslugify';
import { cn } from '../../../utils/utils';
import React from 'react';
import { Question } from './uradio';
import { useUForm } from '../../pages/_sandbox/uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../../pages/_sandbox/_sandbox';

export interface UInputElementP {
  name: string;
  value: string;
  label: string;
  onChange: (v: string) => void;
  validity: Validity;
  feedBack?: string;
  readonly: boolean;
}

export const UInputElement = ({ name, value, label, validity, feedBack = '', onChange, readonly }: UInputElementP) => {
  const id = `${name}-${sslugify(label)}`;
  const cns = cn('form-control', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' });
  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className={cns}
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={id}
        readOnly={readonly}
      />
      {validity === 'INVALID' && <div className="invalid-feedback">{feedBack}</div>}
      {validity === 'VALID' && <div className="valid-feedback">{feedBack}</div>}
    </>
  );
};

export const UInput = ({ question, correctAnswer, explanation }: Question) => {
  const name = sslugify(question);
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { value, validationError, wasSubmitted } = getFieldInfo(name);

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (wasSubmitted) validity = value === correctAnswer ? 'VALID' : 'INVALID';

  useMount(() => {
    addField(name, correctAnswer);
    return () => removeField(name);
  });

  return (
    <UInputElement
      name={name}
      value={value}
      label={question}
      onChange={(s) => onChange(name, s)}
      validity={validity}
      feedBack={validationError ? validationError : explanation}
      readonly={wasSubmitted}
    />
  );
};
