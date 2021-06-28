import React from 'react';
import { RadioField } from './radio-field';
import { UChecksP } from '../../../../uform/ufields/uchecks';

const radioFieldDefault: UChecksP = {
  _id: 'radioFieldDefault',
  question: 'Select one:',
  explanation: 'Cuz',
  correctAnswer: ['This is Correctly Capitalized option'],
  options: ['This is Correctly Capitalized option', 'Option 2'],
};

export const SField = {
  RadioFieldDefault: () => <RadioField {...radioFieldDefault} />,
};
