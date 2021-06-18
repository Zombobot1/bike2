import React from 'react';
import { Story, Meta } from '@storybook/react';

import { RadioField } from '../../components/study/training/qa-card/field/radio-field';
import { Question } from '../../components/study/training/types';
import { radioFieldDefault } from '../../components/study/training/qa-card/field/field-stories';

export default {
  title: 'Training/Fields',
  component: RadioField,
} as Meta;

const Template: Story<Question> = (args) => <RadioField {...args} />;

export const RadioFieldDefault = Template.bind({});
RadioFieldDefault.args = { ...radioFieldDefault };
