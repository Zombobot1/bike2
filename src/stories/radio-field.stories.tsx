import React from 'react';
import { Story, Meta } from '@storybook/react';

import { URadio } from '../components/uform/ufields/uradio';
import { RadioField, RadioFieldP } from '../components/study/training/qa-card/field/radio-field';

export default {
  title: 'Fields/RadioField',
  component: RadioField,
  subcomponents: { URadio },
} as Meta;

const Template: Story<RadioFieldP> = (args) => <RadioField {...args} />;

export const Default = Template.bind({});
Default.args = {
  question: 'Select one:',
  explanation: 'Cuz',
  correctAnswer: 'This is Correctly Capitalized option',
  options: ['This is Correctly Capitalized option', 'Option 2'],
  isCurrent: true,
};
