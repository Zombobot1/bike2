import { Training, TrainingDTO } from './training';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { trainings } from '../../../../content/content';
import { useMedia } from '../../../utils/hooks/use-media';
import { SM } from '../../../../config';

export const TrainingT = (args: TrainingDTO) => {
  const [isFinished, toggle] = useToggle(false);
  const isMobile = useMedia([SM], [true], false);

  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: isMobile ? '380px' : '500px', height: isMobile ? '715px' : '830px' }}
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

export const STraining = {
  simple: () => <TrainingT {...trainings.simple} />,
  withUpdateFromServer: () => <TrainingT {...trainings.withUpdateFromServer} />,
  interactive: () => <TrainingT {...trainings.interactive} />,
  combined: () => <TrainingT {...trainings.combined} />,
  autofocusCheck: () => <TrainingT {...trainings.autofocusCheck} />,
};
