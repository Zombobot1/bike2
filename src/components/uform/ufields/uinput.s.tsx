import { useState } from 'react';
import { TipOnMobile, UInputElement } from './uinput';

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

const TUInput = ({
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

export const Default = () => <TUInput {...defaultI} />;
export const Right = () => <TUInput {...rightI} />;
export const Wrong = () => <TUInput {...wrongI} />;
export const Invalid = () => <TUInput {...invalidI} />;
