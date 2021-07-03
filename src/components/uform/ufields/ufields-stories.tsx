import { QuestionP, UChecksElement } from './uchecks';
import { TipOnMobile, UInputElement } from './uinput';
import React, { useState } from 'react';

export interface TUChecksP extends QuestionP {
  _id: string;
  wasSubmitted: boolean;
  value: string[];
  validationError: string;
  selectMultiple: boolean;
}

export const TUChecks = ({
  _id,
  question,
  options,
  correctAnswer,
  explanation,
  value,
  wasSubmitted,
  validationError,
  selectMultiple,
}: TUChecksP) => {
  const [value_, setValue] = useState(value);
  return (
    <div className="bg-white p-3  w-50 rounded">
      <UChecksElement
        _id={_id}
        value={value_}
        onChange={(_, v) => setValue(v)}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
        options={options}
        question={question}
        correctAnswer={correctAnswer}
        explanation={explanation}
        selectMultiple={selectMultiple}
      />
    </div>
  );
};

const selectOneOptions = [
  'Option 1',
  'Option 2',
  'Looooooooooooooooooong text inside this option renders without visual deffects',
];
const selectOneCorrectAnswer = ['Option 1'];

const radioData: TUChecksP = {
  _id: 'radioData',
  question: 'Please select',
  options: selectOneOptions,
  correctAnswer: selectOneCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: false,
};

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong'];
const selectMultipleCorrectAnswer = ['Right', 'Also right'];

const checksData: TUChecksP = {
  _id: 'checksData',
  question: 'Please select',
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: true,
};

const selectOne: TUChecksP = {
  ...radioData,
};

const selectMany: TUChecksP = {
  ...checksData,
};

const right: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 1'],
};
const wrong: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 2'],
};
const invalid: TUChecksP = {
  ...radioData,
  validationError: 'Required field',
};

const wrongMultiple: TUChecksP = {
  ...radioData,
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  wasSubmitted: true,
  value: ['Right', 'Also wrong', 'Wrong'],
  selectMultiple: true,
};

export const SUChecksElement = {
  selectOne: () => <TUChecks {...selectOne} />,
  selectMany: () => <TUChecks {...selectMany} />,
  right: () => <TUChecks {...right} />,
  wrong: () => <TUChecks {...wrong} />,
  wrongMultiple: () => <TUChecks {...wrongMultiple} />,
  invalid: () => <TUChecks {...invalid} />,
};

interface TUInputP {
  _id: string;
  question: string;
  explanation: string;
  value: string;
  autoFocus: boolean;
  wasSubmitted: boolean;
  correctAnswer: string;
  validationError: string;
  tipOnMobile: TipOnMobile;
}

export const TUInput = ({
  _id,
  question,
  correctAnswer,
  explanation,
  value,
  wasSubmitted,
  validationError,
  autoFocus,
  tipOnMobile,
}: TUInputP) => {
  const [value_, setValue] = useState(value);
  return (
    <div className="bg-white p-3 w-50">
      <UInputElement
        _id={_id}
        value={value_}
        onChange={setValue}
        question={question}
        wasSubmitted={wasSubmitted}
        explanation={explanation}
        autoFocus={autoFocus}
        validationError={validationError}
        correctAnswer={correctAnswer}
        tipOnMobile={tipOnMobile}
      />
    </div>
  );
};

const defaultI: TUInputP = {
  _id: 'defaultI',
  question: 'Enter abc',
  value: '',
  autoFocus: false,
  wasSubmitted: false,
  correctAnswer: 'abc',
  explanation: 'abc',
  validationError: '',
  tipOnMobile: 'SHOW_TIP',
};

const rightI: TUInputP = {
  ...defaultI,
  value: 'abc',
  wasSubmitted: true,
};

const wrongI: TUInputP = {
  ...defaultI,
  value: 'ab',
  wasSubmitted: true,
};

const invalidI: TUInputP = {
  ...defaultI,
  validationError: 'Required field',
  wasSubmitted: false,
};
export const SUInputElement = {
  Default: () => <TUInput {...defaultI} />,
  Right: () => <TUInput {...rightI} />,
  Wrong: () => <TUInput {...wrongI} />,
  Invalid: () => <TUInput {...invalidI} />,
};
