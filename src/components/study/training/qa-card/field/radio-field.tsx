import { URadio } from '../../../../uform/ufields/uradio';
import { shuffle } from '../../../../../utils/algorithms';
import React, { useState } from 'react';
import { Question } from '../../types';

export interface RadioFieldP extends Question {
  isCurrent: boolean;
}

export const RadioField = ({ question, explanation, correctAnswer, options, isCurrent }: RadioFieldP) => {
  if (!isCurrent) return null;
  const [shuffledOptions] = useState(shuffle(options));
  return (
    <URadio question={question} options={shuffledOptions} correctAnswer={correctAnswer} explanation={explanation} />
  );
};
