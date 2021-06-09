import { sslugify } from '../../../utils/sslugify';
import { cn } from '../../../utils/utils';
import React, { useState } from 'react';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../types';
import { QuestionWithoutOptions } from './uradio';

type TipOnMobile = 'SHOW_TIP' | 'HIDE_TIP';

export interface UInputElementP {
  name: string;
  value: string;
  label: string;
  onChange: (v: string) => void;
  validity: Validity;
  feedBack?: string;
  readonly: boolean;
  tipOnMobile?: TipOnMobile;
}

export const UInputElement = ({
  name,
  value,
  label,
  validity,
  feedBack = '',
  onChange,
  readonly,
  tipOnMobile = 'HIDE_TIP',
}: UInputElementP) => {
  const [type, setType] = useState(tipOnMobile === 'HIDE_TIP' ? 'password' : 'text');
  const id = `${name}-${sslugify(label)}`;
  const cns = cn('form-control', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' });
  return (
    <div className="uinput">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={cns}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setType('text')}
        id={id}
        disabled={readonly}
      />
      {validity === 'INVALID' && <div className="invalid-feedback">{feedBack}</div>}
      {validity === 'VALID' && <div className="valid-feedback">{feedBack}</div>}
    </div>
  );
};

export interface UInputP extends QuestionWithoutOptions {
  tipOnMobile?: TipOnMobile;
}

export const UInput = ({
  question,
  correctAnswer,
  explanation,
  initialAnswer = '',
  tipOnMobile = 'HIDE_TIP',
}: UInputP) => {
  const { addField, getFieldInfo, removeField, onChange, fieldsCounter } = useUForm();
  const [fieldsCounterStr] = useState(() => String(fieldsCounter));
  const name = sslugify(question) + fieldsCounterStr;
  const { value, validationError, wasSubmitted } = getFieldInfo(name);

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (wasSubmitted) validity = value === correctAnswer ? 'VALID' : 'INVALID';

  useMount(() => {
    addField(name, correctAnswer, initialAnswer);
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
      tipOnMobile={tipOnMobile}
    />
  );
};
