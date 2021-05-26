import { RadioData, URadio } from '../../../../uform/ufields/uradio';
import { findAll, safeSplit, shuffle } from '../../../../../utils/algorithms';
import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../../../../utils/utils';

const OPTIONS_R = /(?:\([*]*\) |\(\([*]*\)\) )/gm;
const RADIO_SEP = '\n';
const radioParser = (data: string): RadioData => {
  const parts = safeSplit(data, RADIO_SEP);
  if (parts.length < 2) throw new Error('Bad radio data');

  const options = safeSplit(parts[1], OPTIONS_R).map((o) => capitalizeFirstLetter(o));
  const correctOptionIndex = findAll(data, OPTIONS_R).findIndex((s) => s.includes('*'));
  return {
    question: capitalizeFirstLetter(parts[0]),
    options,
    correctAnswer: options[correctOptionIndex],
    explanation: parts[2],
  };
};
const radioParserShuffled = (data: string): RadioData => {
  const result = radioParser(data);
  return { ...result, options: shuffle(result.options) };
};

export interface RadioFieldP {
  data: string;
  isCurrent: boolean;
}

export const RadioField = ({ data, isCurrent }: RadioFieldP) => {
  if (!isCurrent) return null;
  const [{ question, options, explanation, correctAnswer }] = useState(radioParserShuffled(data));
  return <URadio question={question} options={options} correctAnswer={correctAnswer} explanation={explanation} />;
};
