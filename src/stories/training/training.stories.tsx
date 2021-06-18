import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TrainingWrapper, TrainingDTO } from '../../components/study/training/training';
import { handlers } from '../../api/fake-api';
import { trainings } from '../../content';
import { TrainingT } from '../../components/study/training/training/training-stories';

export default {
  title: 'Training/Training',
  component: TrainingT,
  subcomponents: { TrainingWrapper },
} as Meta;

const Template: Story<TrainingDTO> = (args) => <TrainingT {...args} />;

export const Simple = Template.bind({});
Simple.args = { ...trainings.simple };
Simple.parameters = { msw: handlers };
