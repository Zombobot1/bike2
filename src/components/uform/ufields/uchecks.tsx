import './uradio.scss';
import { sslugify } from '../../../utils/sslugify';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/utils';
import { Validity } from '../types';
import { Question } from '../../study/training/types';
import { fn, Fn } from '../../../utils/types';
import _ from 'lodash';
import { InteractiveQuestion } from './interactive-question';

export interface USelectInputP {
  type: string;
  _id: string;
  label: string;
  onChange: (v: string) => void;
  checked: boolean;
  validity: Validity;
  readonly: boolean;
  isLast: boolean;
}

export const USelectInput = ({ type, _id, label, validity, onChange, checked, readonly, isLast }: USelectInputP) => {
  const id = `${_id}-${sslugify(label)}`;
  const cns = cn('form-check-input', {
    'is-valid': validity === 'VALID',
    'is-invalid': validity === 'INVALID',
  });
  const divcns = cn('form-check uradio_input', { 'mb-2': !isLast, 'mb-0': isLast });
  return (
    <div className={divcns}>
      <input
        className={cns}
        type={type}
        name={_id}
        value={label}
        onChange={() => onChange(label)}
        id={id}
        checked={checked}
        disabled={readonly}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export interface QuestionP extends Question {
  initialAnswer?: string[];
}

export type QuestionWithoutOptions = Omit<QuestionP, 'options'>;

function optionValidity(option: string, value: string[], correctAnswer: string[]): Validity {
  if (correctAnswer.includes(option)) return 'VALID';
  else if (value.includes(option) && !correctAnswer.includes(option)) return 'INVALID';
  return 'NONE';
}

export interface UChecksElementP extends QuestionP {
  _id: string;
  value: string[];
  onChange: (radioName: string, value: string[]) => void;
  validationError: string;
  wasSubmitted: boolean;
  selectMultiple?: boolean;
}

export const UChecksElement = ({
  onChange,
  _id,
  correctAnswer,
  options,
  question,
  explanation,
  validationError,
  value,
  wasSubmitted,
  selectMultiple = false,
}: UChecksElementP) => {
  const [overallValidity, setOverallValidity] = useState<Validity>('NONE');

  function onOptionClick(clickedOption: string) {
    if (value.includes(clickedOption))
      onChange(
        _id,
        value.filter((v) => v !== clickedOption),
      );
    else if (!selectMultiple) onChange(_id, [clickedOption]);
    else onChange(_id, [...value, clickedOption]);
  }

  useEffect(() => {
    if (!wasSubmitted) return;
    const invalidOption = options.find((o) => optionValidity(o, value, correctAnswer) === 'INVALID');
    setOverallValidity(invalidOption ? 'INVALID' : 'VALID');
  }, [wasSubmitted]);

  return (
    <div className="uchecks">
      <InteractiveQuestion question={question} status={overallValidity} />
      {options.map((o, i) => {
        let validity: Validity = 'NONE';
        if (validationError) validity = 'INVALID';
        else if (wasSubmitted) validity = optionValidity(o, value, correctAnswer);
        return (
          <USelectInput
            type={selectMultiple ? 'checkbox' : 'radio'}
            key={i}
            _id={_id}
            label={o}
            validity={validity}
            onChange={onOptionClick}
            checked={value.includes(o)}
            readonly={wasSubmitted}
            isLast={i === options.length - 1}
          />
        );
      })}
      {validationError && <p className="ufield__error">{validationError}</p>}
      {wasSubmitted && _.difference(value, correctAnswer).length !== 0 && (
        <p className="ufield__error">{explanation}</p>
      )}
      {wasSubmitted && !_.difference(value, correctAnswer).length && <p className="ufield__success">{explanation}</p>}
    </div>
  );
};

export interface UChecksP extends Question {
  _id: string;
  onAnswer?: Fn;
  initialAnswer?: string[];
  selectMultiple?: boolean;
  submitOnSelect?: boolean;
}

export const UChecks = ({
  _id,
  question,
  correctAnswer,
  explanation,
  options,
  initialAnswer,
  selectMultiple = false,
  onAnswer = fn,
  submitOnSelect = true,
}: UChecksP) => {
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { validationError, value, wasSubmitted } = getFieldInfo(_id);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (value[0] && submitOnSelect) setCanSubmit(true);
  }, [value]);

  useEffect(() => {
    if (canSubmit) {
      onAnswer();
      setCanSubmit(false);
    }
  }, [canSubmit]);

  useMount(() => {
    addField(_id, correctAnswer, initialAnswer);
    return () => removeField(_id);
  });

  return (
    <UChecksElement
      _id={_id}
      onChange={onChange}
      value={value}
      explanation={explanation}
      correctAnswer={correctAnswer}
      options={options}
      question={question}
      validationError={validationError}
      wasSubmitted={wasSubmitted}
      selectMultiple={selectMultiple}
    />
  );
};
