import { Training, TrainingDTO } from './training'
import { MemoryRouter } from 'react-router-dom'
import { trainings } from '../../../../content/trainingsAndDecks'
import { Stack, Button } from '@material-ui/core'
import { useIsSM, useToggle } from '../../../utils/hooks/hooks'

const TrainingT = (args: TrainingDTO) => {
  const [isFinished, toggle] = useToggle(false)
  const isDesktop = useIsSM()

  return (
    <MemoryRouter initialEntries={['/studying/']}>
      <Stack
        justifyContent="center"
        alignItems="center"
        style={{ width: isDesktop ? '500px' : '380px', height: isDesktop ? '830px' : '715px' }}
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
  )
}

export const Simple = () => <TrainingT {...trainings.simple} />
export const WithUpdateFromServer = () => <TrainingT {...trainings.withUpdateFromServer} />
export const Interactive = () => <TrainingT {...trainings.interactive} />
export const Combined = () => <TrainingT {...trainings.combined} />
export const AutofocusCheck = () => <TrainingT {...trainings.autofocusCheck} />
export const CountingStats = () => <TrainingT {...trainings.statsCheck} />
