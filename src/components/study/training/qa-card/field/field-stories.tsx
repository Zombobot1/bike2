import React from 'react';
import { Question } from '../../types';
import { RadioField } from './radio-field';

const radioFieldDefault: Question = {
  question: 'Select one:',
  explanation: 'Cuz',
  correctAnswer: ['This is Correctly Capitalized option'],
  options: ['This is Correctly Capitalized option', 'Option 2'],
};

export const SField = {
  RadioFieldDefault: () => <RadioField {...radioFieldDefault} />,
};
