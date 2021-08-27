import { TrainingCard } from './training-card'
import { TrainingConceptsInfoP } from './training-cards-info/training-concepts-info'
import { MemoryRouter } from 'react-router-dom'
import { useState } from 'react'
import { Box } from '@material-ui/core'
import { COLORS } from '../../../../utils/Shell/theming/theme'

type TrainingCardT = {
  name: string
  path: string
  conceptsInfo: TrainingConceptsInfoP
}

function TrainingCardT({ name, path, conceptsInfo }: TrainingCardT) {
  const [info, setInfo] = useState(conceptsInfo)

  return (
    <MemoryRouter initialEntries={['/app/studying/']}>
      <Box
        sx={{ height: 150, width: 380, padding: 2, backgroundColor: COLORS.light }}
        onClick={() => setInfo((i) => ({ ...i, toLearn: i.toLearn + 10 }))}
      >
        <TrainingCard _id={'1'} deckName={name} deckPath={path} deckColor={'#735cfc'} trainingConceptsInfo={info} />
      </Box>
    </MemoryRouter>
  )
}

export const MovesOnHover = () => (
  <TrainingCardT
    name="Chapter 2"
    path="New headway"
    conceptsInfo={{
      toLearn: 15,
      toRepeat: 99,
    }}
  />
)

export const LotsOfInformation = () => (
  <TrainingCardT
    name="Very Loooooooooooong naaaaaaame longeeeeeeeer than 2 rows"
    path="Reallllllly Loooooooooooong nameeeeeeee"
    conceptsInfo={{
      toLearn: 1500,
      toRepeat: 1500,
    }}
  />
)

export const Pathless = () => (
  <TrainingCardT
    name="Deck name"
    path=""
    conceptsInfo={{
      toLearn: 500,
      toRepeat: 100,
    }}
  />
)

export const NothingToLearn = () => (
  <TrainingCardT
    name="Deck name"
    path=""
    conceptsInfo={{
      toLearn: 0,
      toRepeat: 100,
    }}
  />
)

export const NothingToRepeat = () => (
  <TrainingCardT
    name="Deck name"
    path=""
    conceptsInfo={{
      toLearn: 500,
      toRepeat: 0,
    }}
  />
)
