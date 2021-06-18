import { Training, TrainingDTO } from './training';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

export const TrainingT = (args: TrainingDTO) => {
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
