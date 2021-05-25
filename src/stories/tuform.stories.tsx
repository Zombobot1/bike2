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

const q = (question: string, correctAnswer: string, explanation: string) => ({ question, correctAnswer, explanation });
const basicQ = q('Type: a', 'a', 'Just type it using keyboard');
const sillyQ = q('Question 1', 'right', 'Cuz');

export const DoNotSubmitIfEmpty = Template.bind({});
DoNotSubmitIfEmpty.args = {
  questions: [basicQ],
  isExtensible: false,
};

export const CheckAnswersOnSubmission = Template.bind({});
CheckAnswersOnSubmission.args = {
  questions: [basicQ, q('Type: b', 'b', 'Just type it using keyboard')],
  isExtensible: false,
};

export const NoDataRaceOnAddRemove = Template.bind({});
NoDataRaceOnAddRemove.args = {
  questions: [sillyQ],
  isExtensible: true,
};

export const ReadOnlyAfterSubmit = Template.bind({});
ReadOnlyAfterSubmit.args = {
  questions: [basicQ, q('Type: b', 'b', 'Just type it using keyboard')],
  isExtensible: false,
};
