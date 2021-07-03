import './uradio.scss';
import { useUForm } from '../uform';
import { useMount } from '../../../utils/hooks-utils';
import React, { useEffect, useState } from 'react';
import { Validity } from '../types';
import { Question } from '../../study/training/types';
import { fn, Fn } from '../../../utils/types';
import _ from 'lodash';
import { InteractiveQuestion } from './interactive-question';
import { Checkbox, FormControlLabel, Radio, RadioGroup, styled } from '@material-ui/core';
import { ErrorText, SuccessText } from './feedback';
import { useValidationColor } from './useValidationColor';

const Div = styled('div')({
  marginBottom: 20,
});

export interface USelectInputP {
  selectMultiple: boolean;
  _id: string;
  label: string;
  onChange: (v: string) => void;
  checked: boolean;
  validity: Validity;
  readonly: boolean;
}

export const USelectInput = ({ selectMultiple, _id, label, validity, onChange, checked, readonly }: USelectInputP) => {
  const color = useValidationColor(validity);

  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiFormControlLabel-label.Mui-disabled': { color },
          '& .PrivateSwitchBase-root': {
            color,
            '&.Mui-checked': { color },
          },
        };

  return (
    <FormControlLabel
      value={label}
      control={selectMultiple ? <Checkbox /> : <Radio />}
      label={label}
      sx={sx}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
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
    <Div>
      <InteractiveQuestion question={question} status={overallValidity} />
      <RadioGroup name={_id}>
        {options.map((o, i) => {
          let validity: Validity = 'NONE';
          if (validationError) validity = 'INVALID';
          else if (wasSubmitted) validity = optionValidity(o, value, correctAnswer);
          return (
            <USelectInput
              selectMultiple={selectMultiple}
              key={i}
              _id={_id}
              label={o}
              validity={validity}
              onChange={onOptionClick}
              checked={value.includes(o)}
              readonly={wasSubmitted}
            />
          );
        })}
      </RadioGroup>
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {wasSubmitted && _.difference(value, correctAnswer).length !== 0 && <ErrorText>{explanation}</ErrorText>}
      {wasSubmitted && !_.difference(value, correctAnswer).length && <SuccessText>{explanation}</SuccessText>}
    </Div>
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
