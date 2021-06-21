import { QuestionP, UChecksElement } from './uchecks';
import { TipOnMobile, UInputElement } from './uinput';
import React, { useState } from 'react';
import { sslugify } from '../../../utils/sslugify';

export interface TUChecksP extends QuestionP {
  wasSubmitted: boolean;
  value: string[];
  validationError: string;
  selectMultiple: boolean;
}

export const TUChecks = ({
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
        name={sslugify(question)}
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
  question: 'Please select',
  options: selectOneOptions,
  correctAnswer: selectOneCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: false,
};
const defaultR: TUChecksP = {
  ...radioData,
};
const rightR: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 1'],
};
const wrongR: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 2'],
};
const invalidR: TUChecksP = {
  ...radioData,
  validationError: 'Required field',
};

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong'];
const selectMultipleCorrectAnswer = ['Right', 'Also right'];

const wrongMultiple: TUChecksP = {
  ...radioData,
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  wasSubmitted: true,
  value: ['Right', 'Also wrong', 'Wrong'],
  selectMultiple: true,
};

export const SUChecksElement = {
  SelectOne: () => <TUChecks {...defaultR} />,
  Right: () => <TUChecks {...rightR} />,
  Wrong: () => <TUChecks {...wrongR} />,
  WrongMultiple: () => <TUChecks {...wrongMultiple} />,
  Invalid: () => <TUChecks {...invalidR} />,
};

interface TUInputP {
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
        name={sslugify(question)}
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
