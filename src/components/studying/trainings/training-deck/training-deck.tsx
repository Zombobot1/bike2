import { TrainingsGroupDTO } from '../../training/training/training'
import { Autocomplete, Stack, TextField, styled } from '@mui/material'
import { TrainingCard } from './training-card/training-card'

export interface NamedDeck {
  deckName: string
}

const Card = styled('div', { label: 'TrainingDeck' })({
  marginBottom: '20px',
})

export const TrainingDeck = ({ rootDeckName, trainings }: TrainingsGroupDTO) => {
  // const sx = useMQ({ width: 310 }, { width: '100%' })

  return (
    <Card>
      <Autocomplete
        disableClearable
        value={rootDeckName}
        options={[rootDeckName]}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        sx={{ marginBottom: 2 }}
      />
      <Stack spacing={2}>
        {trainings.map((e, i) => (
          <TrainingCard {...e} key={i} />
        ))}
      </Stack>
    </Card>
  )
}
