import { sslugify } from '../../../utils/sslugify';
import { cn } from '../../../utils/utils';
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../types';
import { QuestionWithoutOptions } from './uchecks';
import { Fn, fn } from '../../../utils/types';
import { usePresentationTransition } from '../../study/training/training/presentation';
import { useToggle } from '../../utils/hooks/use-toggle';
import { InteractiveQuestion } from './interactive-question';

const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);
  const focus = () => {
    if (ref.current) ref.current.focus();
  };

  return { ref, focus };
};

export type TipOnMobile = 'SHOW_TIP' | 'HIDE_TIP';

export interface UInputElementP {
  name: string;
  value: string;
  question: string;
  onChange: (v: string) => void;
  correctAnswer: string;
  explanation: string;
  validationError: string;
  wasSubmitted: boolean;
  onEnter?: Fn;
  tipOnMobile?: TipOnMobile;
  autoFocus?: boolean;
}

export const UInputElement = ({
  name,
  value,
  question,
  correctAnswer,
  explanation,
  onChange,
  wasSubmitted,
  tipOnMobile = 'HIDE_TIP',
  onEnter = fn,
  autoFocus = true,
  validationError,
}: UInputElementP) => {
  const [type, setType] = useState(tipOnMobile === 'HIDE_TIP' ? 'password' : 'text');
  const id = `${name}-${sslugify(question)}`;

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (wasSubmitted && value !== correctAnswer) validity = 'INVALID';
  else if (wasSubmitted && value === correctAnswer) validity = 'VALID';

  const cns = cn('form-control', {
    'is-valid': validity === 'VALID',
    'is-invalid': validity === 'INVALID',
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') onEnter();
  };

  // severe interference with swiper js: if focus is set until animation ends swiper might get broken (UB)
  const { ref, focus } = useFocus();
  const { isInTransition } = usePresentationTransition();
  const [tryFocus, toggleTryFocus] = useToggle(false);

  useEffect(() => {
    if (autoFocus && tryFocus && !isInTransition) focus();
  }, [isInTransition, tryFocus]);

  useMount(() => setTimeout(toggleTryFocus, 100));

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="uinput">
        <InteractiveQuestion question={question} id={id} status={validity} />
        <input
          className={cns}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setType('text')}
          id={id}
          disabled={wasSubmitted}
          onKeyDown={handleKeyDown}
          ref={ref}
          autoComplete="one-time-code"
        />
        {validationError && <div className="ufield__error">{validationError}</div>}
        {!validationError && validity === 'INVALID' && <div className="ufield__error">{explanation}</div>}
        {validity === 'VALID' && <div className="ufield__success">{explanation}</div>}
      </div>
    </form>
  );
};

export interface UInputP extends QuestionWithoutOptions {
  tipOnMobile?: TipOnMobile;
  onAnswer?: Fn;
  autoFocus?: boolean;
}

export const UInput = ({
  question,
  correctAnswer,
  explanation,
  initialAnswer,
  tipOnMobile = 'HIDE_TIP',
  onAnswer = fn,
  autoFocus = true,
}: UInputP) => {
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const name = sslugify(question);
  const { value, validationError, wasSubmitted } = getFieldInfo(name);

  useMount(() => {
    addField(name, correctAnswer, initialAnswer);
    return () => removeField(name);
  });

  return (
    <UInputElement
      name={name}
      correctAnswer={correctAnswer[0]}
      validationError={validationError}
      value={value[0]}
      question={question}
      onChange={(s) => onChange(name, [s])}
      explanation={validationError ? validationError : explanation}
      wasSubmitted={wasSubmitted}
      tipOnMobile={tipOnMobile}
      onEnter={onAnswer}
      autoFocus={autoFocus}
    />
  );
};
