import React, { useState } from 'react';
import { RadioData, URadioElement } from '../components/uform/ufields/uradio';
import { sslugify } from '../utils/sslugify';

export interface TURadioP extends RadioData {
  wasSubmitted: boolean;
  value: string;
}

export const TURadio = ({ question, options, correctAnswer, explanation, value, wasSubmitted }: TURadioP) => {
  const [value_, setValue] = useState(value);
  return (
    <URadioElement
      name={sslugify(question)}
      value={value_}
      onChange={(_, v) => setValue(v)}
      validationError={''}
      wasSubmitted={wasSubmitted}
      options={options}
      question={question}
      correctAnswer={correctAnswer}
      explanation={explanation}
    />
  );
};
