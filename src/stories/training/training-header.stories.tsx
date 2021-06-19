import 'bootstrap';
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { TrainingHeader } from '../../components/study/training/training-header';
import {
  atEndA,
  atStartA,
  atTimeoutA,
  canDeleteCardA,
  originalHeaderA,
  TrainingHeaderT,
  TrainingHeaderTP,
} from '../../components/study/training/training-header/training-header-stories';

export default {
  title: 'Training/Training header',
  component: TrainingHeader,
} as Meta;

const Template: Story<TrainingHeaderTP> = (args) => <TrainingHeaderT {...args} />;

export const OriginalHeader = Template.bind({});
OriginalHeader.args = { ...originalHeaderA };

export const AtStart = Template.bind({});
AtStart.args = { ...atStartA };

export const AtEnd = Template.bind({});
AtEnd.args = { ...atEndA };

export const AtTimeout = Template.bind({});
AtTimeout.args = { ...atTimeoutA };

export const CanDeleteCard = Template.bind({});
CanDeleteCard.args = { ...canDeleteCardA };
