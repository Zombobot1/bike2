import React from 'react';
import { Story, Meta } from '@storybook/react';
import { QACardP } from '../../components/study/training/qa-card';

import {
  allFieldsShownA,
  estimatedA,
  hiddenA,
  interactiveAndPassiveA,
  longTextA,
  minimalA,
  minimalHiddenA,
  QACardT,
} from '../../components/study/training/qa-card/qa-card-stories';

export default {
  title: 'Training/Card',
  component: QACardT,
} as Meta;

const Template: Story<QACardP> = (args) => <QACardT {...args} />;

export const Hidden = Template.bind({});
Hidden.args = { ...hiddenA };

export const AllFieldsShown = Template.bind({});
AllFieldsShown.args = { ...allFieldsShownA };

export const Estimated = Template.bind({});
Estimated.args = { ...estimatedA };

export const MinimalHidden = Template.bind({});
MinimalHidden.args = { ...minimalHiddenA };

export const Minimal = Template.bind({});
Minimal.args = { ...minimalA };

export const LongText = Template.bind({});
LongText.args = { ...longTextA };

export const InteractiveAndPassive = Template.bind({});
InteractiveAndPassive.args = { ...interactiveAndPassiveA };
