import { sslugify } from '../../../utils/sslugify';
import { cn } from '../../../utils/utils';
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../types';
import { QuestionWithoutOptions } from './uradio';
import { Fn, fn } from '../../../utils/types';
import { usePresentationTransition } from '../../study/training/training/presentation';
import { useToggle } from '../../utils/hooks/use-toggle';

const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);
  const focus = () => {
    if (ref.current) ref.current.focus();
  };

  return { ref, focus };
};

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

  // severe interference with swiper js: if focus is set until animation ends swiper might get broken (UB)
  const { ref, focus } = useFocus();
  const { isInTransition } = usePresentationTransition();
  const [tryFocus, toggleTryFocus] = useToggle(false);

  useEffect(() => {
    if (tryFocus && !isInTransition) focus();
  }, [isInTransition, tryFocus]);

  useMount(() => setTimeout(toggleTryFocus, 100));

  return (
    <form>
      <div className="uinput">
        {label && (
          <label className="form-label interactive-question" htmlFor={id}>
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
          ref={ref}
          autoComplete="one-time-code"
        />
        {validity === 'INVALID' && <div className="invalid-feedback">{feedBack}</div>}
        {validity === 'VALID' && <div className="valid-feedback">{feedBack}</div>}
      </div>
    </form>
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
  else if (wasSubmitted) validity = value === correctAnswer[0] ? 'VALID' : 'INVALID';

  useMount(() => {
    addField(name, correctAnswer[0], initialAnswer);
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
