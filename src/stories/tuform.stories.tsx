import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TUForm, TUFormP } from './tuform';
import { UInput } from '../components/uform/ufields/uinput';

export default {
  title: 'UForm/Form',
  component: TUForm,
  subcomponents: { UInput },
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
  questions: [sillyQ],
  isExtensible: false,
  submitOneByOne: false,
};

export const CheckAnswersOnSubmission = Template.bind({});
CheckAnswersOnSubmission.args = {
  questions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

export const NoDataRaceOnAddRemove = Template.bind({});
NoDataRaceOnAddRemove.args = {
  questions: [sillyQ],
  isExtensible: true,
  submitOneByOne: false,
};

export const ReadOnlyAfterSubmit = Template.bind({});
ReadOnlyAfterSubmit.args = {
  questions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

export const SequentialSubmit = () => (
  <TUForm questions={[basicQ, basicQ2]} isExtensible={false} submitOneByOne={true} />
);
