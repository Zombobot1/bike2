import { Stack, Typography, Slider } from '@mui/material'
import { useReactive } from '../../../utils/hooks/hooks'
import { TrainingHeader } from './training-header'

interface TrainingHeaderTP {
  oneCardTimeToAnswer: number
  cardsLength: number
  currentCardIndex: number
  showMore?: boolean
}

const TrainingHeaderT = ({ cardsLength, oneCardTimeToAnswer, currentCardIndex, showMore = true }: TrainingHeaderTP) => {
  const [cci, setCci] = useReactive(currentCardIndex)
  const ttf = (cardsLength - cci) * oneCardTimeToAnswer

  if (!showMore) {
    return (
      <div style={{ width: '500px' }}>
        <TrainingHeader timeToFinish={ttf} cardsLength={cardsLength} currentCardIndex={cci} />
      </div>
    )
  }

  return (
    <Stack sx={{ width: '500px' }} spacing={2}>
      <TrainingHeader timeToFinish={ttf} cardsLength={cardsLength} currentCardIndex={cci} />
      <hr style={{ minHeight: '1px', width: '100%' }} />
      <div>
        <Typography>Current index</Typography>
        <Slider min={0} max={cardsLength - 1} step={1} value={cci} onChange={(_, v) => setCci(+v.toString())} />
      </div>
    </Stack>
  )
}

const atStartA: TrainingHeaderTP = {
  cardsLength: 10,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 0,
}

const originalHeaderA: TrainingHeaderTP = {
  ...atStartA,
  cardsLength: 110,
  showMore: false,
  currentCardIndex: 67,
}

const atEndA: TrainingHeaderTP = {
  ...atStartA,
  currentCardIndex: 9,
}

const longestCardsLeftInfo: TrainingHeaderTP = {
  ...atStartA,
  cardsLength: 99,
  oneCardTimeToAnswer: 70,
}

export const OriginalHeader = () => <TrainingHeaderT {...originalHeaderA} />
export const AtStart = () => <TrainingHeaderT {...atStartA} />
export const AtEnd = () => <TrainingHeaderT {...atEndA} />
export const LongestCardsLeftInfo = () => <TrainingHeaderT {...longestCardsLeftInfo} />
