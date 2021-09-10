import { TrainingDeck } from './training-deck'
import { trainingDecks } from '../../../../content/trainingsAndDecks'
import { Box } from '@material-ui/core'
import { MemoryRouter } from 'react-router-dom'

const Template = () => {
  return (
    <MemoryRouter initialEntries={['/app/studying/']}>
      <Box sx={{ height: 650, width: 380 }}>
        <TrainingDeck {...trainingDecks[2]} />
      </Box>
    </MemoryRouter>
  )
}

export const Default = () => <Template />
