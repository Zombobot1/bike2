import './uradio.scss';
import { sslugify } from '../../../utils/sslugify';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import React from 'react';
import { cn } from '../../../utils/utils';
import { Validity } from '../types';
import { Question } from '../../study/training/types';

export interface URadioInputP {
  name: string;
  label: string;
  onChange: (v: string) => void;
  checked: boolean;
  validity: Validity;
  readonly: boolean;
}

export const URadioInput = ({ name, label, validity, onChange, checked, readonly }: URadioInputP) => {
  const id = `${name}-${sslugify(label)}`;
  const cns = cn('form-check-input', {
    'is-valid': validity === 'VALID',
    'is-invalid': validity === 'INVALID',
  });

  return (
    <div className="form-check uradio__input mb-2">
      <input
        className={cns}
        type="radio"
        name={name}
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
  initialAnswer?: string;
}

export type QuestionWithoutOptions = Omit<QuestionP, 'options'>;

export interface URadioElementP extends QuestionP {
  name: string;
  value: string;
  onChange: (radioName: string, value: string) => void;
  validationError: string;
  wasSubmitted: boolean;
}

export const URadioElement = ({
  onChange,
  name,
  correctAnswer,
  options,
  question,
  explanation,
  validationError,
  value,
  wasSubmitted,
}: URadioElementP) => {
  return (
    <div className="uradio">
      <p className="interactive-question">{question}</p>
      {options.map((o, i) => {
        let validity: Validity = 'NONE';
        if (validationError) validity = 'INVALID';
        else if (wasSubmitted && value !== correctAnswer) {
          if (o === correctAnswer) validity = 'VALID';
          else if (o === value) validity = 'INVALID';
          else validity = 'NONE';
        } else if (wasSubmitted && value === correctAnswer) validity = value === o ? 'VALID' : 'NONE';
        return (
          <URadioInput
            key={i}
            name={name}
            label={o}
            validity={validity}
            onChange={(v) => onChange(name, v)}
            checked={value === o}
            readonly={wasSubmitted}
          />
        );
      })}
      {validationError && <p className="uradio__error mt-3">{validationError}</p>}
      {wasSubmitted && value !== correctAnswer && <p className="uradio__error mt-3">{explanation}</p>}
      {wasSubmitted && value === correctAnswer && <p className="uradio__success mt-3">{explanation}</p>}
    </div>
  );
};

export const URadio = ({ question, correctAnswer, explanation, options }: Question) => {
  const name = sslugify(question);
  const { addField, getFieldInfo, removeField, onChange } = useUForm();
  const { validationError, value, wasSubmitted } = getFieldInfo(name);

  useMount(() => {
    addField(name, correctAnswer);
    return () => removeField(name);
  });

  return (
    <URadioElement
      name={name}
      onChange={onChange}
      value={value}
      explanation={explanation}
      correctAnswer={correctAnswer}
      options={options}
      question={question}
      validationError={validationError}
      wasSubmitted={wasSubmitted}
    />
  );
};
