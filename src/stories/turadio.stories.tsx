import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TURadio, TURadioP } from './turadio';

export default {
  title: 'UForm/URadio',
  component: TURadio,
} as Meta;

const Template: Story<TURadioP> = (args) => <TURadio {...args} />;

const radioData = {
  question: 'Please select',
  options: ['Option 1', 'Option 2', 'Option 3'],
  correctAnswer: 'Option 1',
  explanation: 'This is a loooooooooooooooooooooong Cuz',
};

export const Default = Template.bind({});
Default.args = {
  ...radioData,
  wasSubmitted: false,
  value: '',
};

export const Submitted = Template.bind({});
Submitted.args = {
  ...radioData,
  wasSubmitted: true,
  value: 'Option 1',
};
