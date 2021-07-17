import { useEffect, useState } from 'react';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';
import { Fn, fn } from '../../../../utils/types';
import { atom, useAtom } from 'jotai';
import { useIsPageVisible } from '../../../../utils/hooks-utils';
import TimerRoundedIcon from '@material-ui/icons/TimerRounded';
import { IconButton, styled } from '@material-ui/core';

const timeToAnswerAtom = atom(0);
const isRunningAtom = atom(true);
const onTimeoutAtom = atom({ on: fn });

const useTrainingTimer_ = () => {
  const [timeToAnswer, setTimeToAnswer] = useAtom(timeToAnswerAtom);
  const [isRunning, setIsRunning] = useAtom(isRunningAtom);
  const [onTimeout_, setOnTimeout_] = useAtom(onTimeoutAtom);

  return {
    timeToAnswer,
    setTimeToAnswer,
    isRunning,
    setIsRunning,
    onTimeout: onTimeout_.on,
    setOnTimeout: (f: Fn) => setOnTimeout_({ on: f }),
  };
};

export const useTrainingTimer = () => {
  const { setOnTimeout, setIsRunning, setTimeToAnswer, isRunning } = useTrainingTimer_();

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);

  return {
    setTimeToAnswer,
    pause,
    resume,
    setOnTimeout,
    isRunning,
  };
};

const TimerContainer = styled('span')({
  position: 'relative',
});

const Time = styled('span')(({ theme }) => ({
  position: 'absolute',
  right: 1,
  color: theme.palette.error.main,
}));

export const TrainingTimer = () => {
  const isPageVisible = useIsPageVisible();
  const { timeToAnswer, setTimeToAnswer, isRunning, onTimeout } = useTrainingTimer_();
  const [delay, setDelay] = useState(1e3);

  useEffect(() => setDelay(isRunning && isPageVisible ? 1e3 : 1e9), [isRunning, isPageVisible]);

  useInterval(() => setTimeToAnswer((t) => (t > 0 ? t - 1 : t)), delay);

  useEffect(() => {
    if (timeToAnswer === 0) onTimeout();
  }, [timeToAnswer]);

  return (
    <TimerContainer sx={{ position: 'relative' }}>
      <IconButton color={timeToAnswer > 5 ? 'default' : 'error'} disabled={!isRunning}>
        <TimerRoundedIcon />
      </IconButton>
      <Time>{fancyTimerTime(timeToAnswer)}</Time>
    </TimerContainer>
  );
};
