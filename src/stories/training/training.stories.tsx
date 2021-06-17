import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TrainingWrapper, TrainingDTO } from '../../components/study/training/training';
import { handlers } from '../../api/fake-api';
import { trainings } from '../../content';
import { MemoryRouter } from 'react-router-dom';
import { Training } from '../../components/study/training/training/training';
import { useToggle } from '../../components/utils/hooks/use-toggle';

export default {
  title: 'Training/Training',
  component: Training,
  subcomponents: { TrainingWrapper },
} as Meta;

const Template: Story<TrainingDTO> = (args) => {
  const [isFinished, toggle] = useToggle(false);
  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: '500px', height: '830px' }}
      >
        {!isFinished && <Training dto={args} onLastCard={toggle} />}
        {isFinished && <h3 className="mb-3">That's all!</h3>}
        {isFinished && (
          <button className="btn btn-primary" onClick={toggle}>
            Again
          </button>
        )}
      </div>
    </MemoryRouter>
  );
};

export const Simple = Template.bind({});
Simple.args = { ...trainings.simple };
Simple.parameters = { msw: handlers };
