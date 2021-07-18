import { Training, TrainingDTO } from './training';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { MemoryRouter } from 'react-router-dom';
import { trainings } from '../../../../content/content';
import { useMedia } from '../../../utils/hooks/use-media';
import { SM } from '../../../../theme';
import { Stack, Button } from '@material-ui/core';

const TrainingT = (args: TrainingDTO) => {
  const [isFinished, toggle] = useToggle(false);
  const isMobile = useMedia([SM], [true], false);

  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <Stack
        justifyContent="center"
        alignItems="center"
        style={{ width: isMobile ? '380px' : '500px', height: isMobile ? '715px' : '830px' }}
      >
        {!isFinished && <Training dto={args} onLastCard={toggle} />}
        {isFinished && <h3>That's all!</h3>}
        {isFinished && (
          <Button variant="contained" onClick={toggle}>
            Again
          </Button>
        )}
      </Stack>
    </MemoryRouter>
  );
};

export const Simple = () => <TrainingT {...trainings.simple} />;
export const WithUpdateFromServer = () => <TrainingT {...trainings.withUpdateFromServer} />;
export const Interactive = () => <TrainingT {...trainings.interactive} />;
export const Combined = () => <TrainingT {...trainings.combined} />;
export const AutofocusCheck = () => <TrainingT {...trainings.autofocusCheck} />;
