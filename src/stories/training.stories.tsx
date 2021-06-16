import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Training, TrainingDTO } from '../components/study/training/training';
import { TrainingHeader } from '../components/study/training/training-header';
import { CardCarousel } from '../components/study/training/training/card-carousel';
import { TrainingControls } from '../components/study/training/training-controls';
import { handlers } from '../api/fake-api';
import { uTraining } from '../content';

export default {
  title: 'Training/Training',
  component: Training,
  subcomponents: { TrainingHeader, CardCarousel, TrainingControls },
} as Meta;

const Template: Story<TrainingDTO> = (args) => (
  <div style={{ width: '500px', height: '715px' }}>
    <Training {...args} />
  </div>
);

export const Simple = Template.bind({});
Simple.args = { ...uTraining };
Simple.parameters = { msw: [handlers] };
