import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import { Validity } from '../types';
import { QuestionWithoutOptions } from './uchecks';
import { Fn, fn } from '../../../utils/types';
import { usePresentationTransition } from '../../study/training/training/presentation';
import { useToggle } from '../../utils/hooks/use-toggle';
import { InteractiveQuestion } from './interactive-question';
import { ErrorText, SuccessText } from './feedback';
import { TextField } from '@material-ui/core';
import { useValidationColor } from './useValidationColor';

const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);
  const focus = () => {
    if (ref.current) ref.current.focus();
  };

  return { ref, focus };
};

export type TipOnMobile = 'SHOW_TIP' | 'HIDE_TIP';

export interface UInputElementP {
  _id: string;
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
  _id,
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

  let validity: Validity = 'NONE';
  if (validationError) validity = 'INVALID';
  else if (wasSubmitted && value !== correctAnswer) validity = 'INVALID';
  else if (wasSubmitted && value === correctAnswer) validity = 'VALID';

  const color = useValidationColor(validity);
  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiInput-root:before': { borderBottomColor: color },
          '& .MuiInputBase-input.Mui-disabled': {
            color,
            '-webkit-text-fill-color': 'unset',
          },
        };

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
      <InteractiveQuestion question={question} status={validity} />
      <TextField
        fullWidth
        variant="standard"
        placeholder="Your answer"
        type={type}
        id={_id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setType('text')}
        disabled={wasSubmitted}
        onKeyPress={handleKeyDown}
        inputRef={ref}
        autoComplete="one-time-code"
        sx={sx}
      />
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {!validationError && validity === 'INVALID' && <ErrorText>{explanation}</ErrorText>}
      {validity === 'VALID' && <SuccessText>{explanation}</SuccessText>}
    </form>
  );
};

export interface UInputP extends QuestionWithoutOptions {
  _id: string;
  tipOnMobile?: TipOnMobile;
  onAnswer?: Fn;
  autoFocus?: boolean;
}

export const UInput = ({
  _id,
  question,
  correctAnswer,
  explanation,
  initialAnswer,
  tipOnMobile = 'HIDE_TIP',
  onAnswer = fn,
  autoFocus = true,
}: UInputP) => {
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { value, validationError, wasSubmitted } = getFieldInfo(_id);

  useMount(() => {
    addField(_id, correctAnswer, initialAnswer);
    return () => removeField(_id);
  });

  return (
    <UInputElement
      _id={_id}
      correctAnswer={correctAnswer[0]}
      validationError={validationError}
      value={value[0]}
      question={question}
      onChange={(s) => onChange(_id, [s])}
      explanation={validationError ? validationError : explanation}
      wasSubmitted={wasSubmitted}
      tipOnMobile={tipOnMobile}
      onEnter={onAnswer}
      autoFocus={autoFocus}
    />
  );
};
