import { useEffect, useState } from 'react'
import { useInterval } from '../../../utils/hooks/use-interval'
import { fancyTimerTime } from '../../../../utils/formatting'
import { Fn, fn } from '../../../../utils/types'
import { atom, useAtom } from 'jotai'
import { useIsPageVisible, useMount } from '../../../../utils/hooks-utils'
import TimerRoundedIcon from '@material-ui/icons/TimerRounded'
import { IconButton, styled } from '@material-ui/core'

const timeToAnswerA = atom(0)
const isRunningA = atom(true)
const onTimeoutA = atom({ on: fn })
const totalTimeA = atom(0)

const useTrainingTimer_ = () => {
  const [timeToAnswer, setTimeToAnswer] = useAtom(timeToAnswerA)
  const [isRunning, setIsRunning] = useAtom(isRunningA)
  const [onTimeout_, setOnTimeout_] = useAtom(onTimeoutA)

  return {
    timeToAnswer,
    setTimeToAnswer,
    isRunning,
    setIsRunning,
    onTimeout: onTimeout_.on,
    setOnTimeout: (f: Fn) => setOnTimeout_({ on: f }),
  }
}

export const useTrainingTimer = () => {
  const { setOnTimeout, setIsRunning, setTimeToAnswer, isRunning } = useTrainingTimer_()

  const [totalTime] = useAtom(totalTimeA)

  const pause = () => setIsRunning(false)
  const resume = () => setIsRunning(true)

  return {
    totalTime,
    setTimeToAnswer,
    pause,
    resume,
    setOnTimeout,
    isRunning,
  }
}

const TimerContainer = styled('span')({
  position: 'relative',
})

const Time = styled('span')(({ theme }) => ({
  position: 'absolute',
  right: 1,
  color: theme.palette.error.main,
}))

export const TrainingTimer = () => {
  const isPageVisible = useIsPageVisible()
  const [_, setTotalTime] = useAtom(totalTimeA)
  const { timeToAnswer, setTimeToAnswer, isRunning, onTimeout } = useTrainingTimer_()
  const [delay, setDelay] = useState(1e3)

  useEffect(() => setDelay(isRunning && isPageVisible ? 1e3 : 1e9), [isRunning, isPageVisible])

  useInterval(() => {
    setTimeToAnswer((t) => (t > 0 ? t - 1 : t))
    setTotalTime((t) => t + 1)
  }, delay)

  useEffect(() => {
    if (timeToAnswer === 0) onTimeout()
  }, [timeToAnswer])

  useMount(() => setTotalTime(0))

  return (
    <TimerContainer sx={{ position: 'relative' }}>
      <IconButton color={timeToAnswer > 5 ? 'default' : 'error'} disabled={!isRunning}>
        <TimerRoundedIcon />
      </IconButton>
      <Time>{fancyTimerTime(timeToAnswer)}</Time>
    </TimerContainer>
  )
}
