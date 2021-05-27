import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TUForm, TUFormP } from './tuform';
import { UInput } from '../components/uform/ufields/uinput';
import { URadio } from '../components/uform/ufields/uradio';

export default {
  title: 'UForm/Form',
  component: TUForm,
  subcomponents: { UInput, URadio },
} as Meta;

const Template: Story<TUFormP> = (args) => <TUForm {...args} />;

const q = (question: string, correctAnswer: string, explanation: string, initialAnswer = '') => ({
  question,
  correctAnswer,
  explanation,
  initialAnswer,
});
const basicQ = q('Type: a', 'a', 'Just type it using keyboard', 'a');
const basicQ2 = q('Type: b', 'b', 'Just type it using keyboard', 'a');
const sillyQ = q('Question 1', 'right', 'Cuz');

export const DoNotSubmitIfEmpty = Template.bind({});
DoNotSubmitIfEmpty.args = {
  writeQuestions: [sillyQ],
  isExtensible: false,
  submitOneByOne: false,
};

export const CheckAnswersOnSubmission = Template.bind({});
CheckAnswersOnSubmission.args = {
  writeQuestions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

export const NoDataRaceOnAddRemove = Template.bind({});
NoDataRaceOnAddRemove.args = {
  writeQuestions: [sillyQ],
  isExtensible: true,
  submitOneByOne: false,
};

export const ReadOnlyAfterSubmit = Template.bind({});
ReadOnlyAfterSubmit.args = {
  writeQuestions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

export const SequentialSubmit = () => (
  <TUForm writeQuestions={[basicQ, basicQ2]} isExtensible={false} submitOneByOne={true} />
);

const longText = 'Looooooooooooooooooong text inside this option renders without visual deffects';

export const Composite = Template.bind({});
Composite.args = {
  writeQuestions: [basicQ],
  isExtensible: false,
  selectOneQuestions: [
    {
      question: 'Select correct',
      options: ['Correct option', longText],
      correctAnswer: 'Correct option',
      explanation: 'Cuz',
    },
  ],
  submitOneByOne: false,
};
