import { Stack } from '@material-ui/core'
import { COLORS } from '../../../application/theming/theme'
import { useMount } from '../../../utils/hooks/hooks'
import { TrainingTimer, useTrainingTimer } from './training-timer'

interface Template {
  isTimerRunning: boolean
  initialTimeToAnswer: number
}

function Template({ initialTimeToAnswer, isTimerRunning }: Template) {
  const { setTimeToAnswer, pause, resume } = useTrainingTimer()

  useMount(() => {
    setTimeToAnswer(initialTimeToAnswer)
    if (!isTimerRunning) pause()
    else resume()
  })

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ width: 100, height: 100, backgroundColor: COLORS.light }}>
      <TrainingTimer />
    </Stack>
  )
}

const hasEnoughTime: Template = {
  isTimerRunning: true,
  initialTimeToAnswer: 99,
}

const lacksOfTime: Template = {
  isTimerRunning: true,
  initialTimeToAnswer: 5,
}

const puased: Template = {
  isTimerRunning: false,
  initialTimeToAnswer: 50,
}

const lacksOfTimeAndPaused: Template = {
  isTimerRunning: false,
  initialTimeToAnswer: 5,
}

export const HasEnoughTime = () => <Template {...hasEnoughTime} />
export const LacksOfTime = () => <Template {...lacksOfTime} />
export const Puased = () => <Template {...puased} />
export const LacksOfTimeAndPaused = () => <Template {...lacksOfTimeAndPaused} />
