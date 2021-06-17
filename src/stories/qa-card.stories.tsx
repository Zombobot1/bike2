import React from 'react';
import { Story, Meta } from '@storybook/react';
import { QACard, QACardP } from '../components/study/training/qa-card';
import { Field } from '../components/study/training/qa-card/field/field';
import { cardWithQandA, uCardLong, uCardMinimal } from '../content';

export default {
  title: 'Training/Card',
  component: QACard,
  subcomponents: { Field },
} as Meta;

const Template: Story<QACardP> = (args) => (
  <div style={{ width: '500px', height: '715px' }}>
    <QACard {...args} />
  </div>
);

export const Hidden = Template.bind({});
Hidden.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  showHidden: false,
  fields: uCardLong.fields,
};

export const AllFieldsShown = Template.bind({});
AllFieldsShown.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardLong.fields,
};

export const Estimated = Template.bind({});
Estimated.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardLong.fields,
  estimation: 'GOOD',
};

export const Minimal = Template.bind({});
Minimal.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardMinimal.fields,
};

export const MinimalHidden = Template.bind({});
MinimalHidden.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: false,
  fields: uCardMinimal.fields,
};

export const LongText = Template.bind({});
LongText.args = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: cardWithQandA.fields,
};
