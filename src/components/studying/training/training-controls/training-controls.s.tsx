import { CardEstimation, CardType, estimationColor } from '../types'
import { useState } from 'react'
import { COLORS } from '../../../utils/Shell/theming/theme'
import { TrainingControls } from './training-controls'
import { useTrainingTimer } from '../training-timer/training-timer'
import { useMount } from '../../../utils/hooks/hooks'
import { Button, Stack, Typography } from '@material-ui/core'
import { bool, fn, num } from '../../../../utils/types'

interface TrainingControlsTP {
  cardType: CardType
  areFieldsHidden: bool
  timeLeft: num
  isAtEnd?: bool
}

const TrainingControlsT = ({ cardType, areFieldsHidden, timeLeft, isAtEnd = false }: TrainingControlsTP) => {
  const [areHidden, setHidden] = useState(areFieldsHidden)
  const [estimation, setEstimation] = useState<CardEstimation | null>(null)
  const [status, setStatus] = useState('')

  const [isTimeOut, setIsTimeOut] = useState(false)
  const [wasDeleted, setWasDeleted] = useState(false)
  const { setTimeToAnswer, setOnTimeout } = useTrainingTimer()

  useMount(() => {
    setOnTimeout(() => setIsTimeOut(true))
    setTimeToAnswer(timeLeft)
  })

  const estimatePassive = (e: CardEstimation) => {
    setEstimation(e)
    setHidden(true)
    return undefined
  }

  const estimateInteractive = (_e: CardEstimation) => {
    setStatus('Ready to go further')
    return () => setStatus('This is next')
  }

  return (
    <Stack alignItems="center" spacing={2} sx={{ width: '500px', backgroundColor: COLORS.light, padding: 2 }}>
      {wasDeleted && (
        <Typography component="h3" color="error">
          Deleted card
        </Typography>
      )}
      {isTimeOut && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setIsTimeOut(false)
            setTimeToAnswer(timeLeft)
          }}
        >
          Timeout! Relaunch
        </Button>
      )}
      {status && <h3>{status}</h3>}
      {estimation && <h3 style={{ color: estimationColor(estimation) }}>{estimation}</h3>}
      <TrainingControls
        isAtEnd={isAtEnd}
        onTrainingEnd={fn}
        cardType={cardType}
        showHiddenFields={() => setHidden(false)}
        areFieldsHidden={areHidden}
        estimate={cardType === 'PASSIVE' ? estimatePassive : estimateInteractive}
        currentCardIndex={0}
        deleteCard={() => setWasDeleted(true)}
        cardId="1"
      />
    </Stack>
  )
}

const passiveCardControls: TrainingControlsTP = {
  cardType: 'PASSIVE',
  areFieldsHidden: true,
  timeLeft: 99,
}

const interactiveCardControls: TrainingControlsTP = {
  cardType: 'INTERACTIVE',
  areFieldsHidden: true,
  timeLeft: 99,
}

const atTimeout: TrainingControlsTP = {
  cardType: 'INTERACTIVE',
  areFieldsHidden: true,
  timeLeft: 1,
}

const atEnd: TrainingControlsTP = {
  ...atTimeout,
  isAtEnd: true,
}

export const PassiveCardControls = () => <TrainingControlsT {...passiveCardControls} />
export const InteractiveCardControls = () => <TrainingControlsT {...interactiveCardControls} />
export const AtTimeout = () => <TrainingControlsT {...atTimeout} />
export const CanDeleteCard = () => <TrainingControlsT {...passiveCardControls} />
export const CanPauseOrResumeTimer = () => <TrainingControlsT {...passiveCardControls} />
export const AtEnd = () => <TrainingControlsT {...atEnd} />
