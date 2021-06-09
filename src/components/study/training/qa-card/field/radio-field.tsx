import { URadio } from '../../../../uform/ufields/uradio';
import { shuffle } from '../../../../../utils/algorithms';
import React, { useState } from 'react';
import { Question } from '../../types';

export const RadioField = ({ question, explanation, correctAnswer, options }: Question) => {
  const [shuffledOptions] = useState(() => shuffle(options));
  return (
    <URadio question={question} options={shuffledOptions} correctAnswer={correctAnswer} explanation={explanation} />
  );
};
