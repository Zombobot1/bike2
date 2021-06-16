import { sslugify } from '../../../utils/sslugify';
import { cn } from '../../../utils/utils';
import React, { useState, KeyboardEvent } from 'react';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../types';
import { QuestionWithoutOptions } from './uradio';
import { Fn, fn } from '../../../utils/types';

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
  onEnter?: Fn;
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
  onEnter = fn,
}: UInputElementP) => {
  const [type, setType] = useState(tipOnMobile === 'HIDE_TIP' ? 'password' : 'text');
  const id = `${name}-${sslugify(label)}`;
  const cns = cn('form-control', { 'is-valid': validity === 'VALID', 'is-invalid': validity === 'INVALID' });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') onEnter();
  };

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
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {validity === 'INVALID' && <div className="invalid-feedback">{feedBack}</div>}
      {validity === 'VALID' && <div className="valid-feedback">{feedBack}</div>}
    </div>
  );
};

export interface UInputP extends QuestionWithoutOptions {
  tipOnMobile?: TipOnMobile;
  onAnswer?: Fn;
}

export const UInput = ({
  question,
  correctAnswer,
  explanation,
  initialAnswer = '',
  tipOnMobile = 'HIDE_TIP',
  onAnswer = fn,
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
      onEnter={onAnswer}
    />
  );
};
