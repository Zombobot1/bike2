import './training-timer.scss';
import React, { useEffect, useState } from 'react';
import { ReactComponent as TimerI } from '../../../icons/bi-clock-history.svg';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';
import { Fn, fn } from '../../../../utils/types';
import { atom, useAtom } from 'jotai';
import { usePageVisibility } from '../../../../utils/hooks-utils';

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
  const { setOnTimeout, setIsRunning, setTimeToAnswer } = useTrainingTimer_();

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);

  return {
    setTimeToAnswer,
    pause,
    resume,
    setOnTimeout,
  };
};

export const TrainingTimer = () => {
  const isPageVisible = usePageVisibility();
  const { timeToAnswer, setTimeToAnswer, isRunning, onTimeout } = useTrainingTimer_();
  const [delay, setDelay] = useState(1e3);

  useEffect(() => setDelay(isRunning && isPageVisible ? 1e3 : 1e9), [isRunning, isPageVisible]);

  useInterval(() => setTimeToAnswer((t) => (t > 0 ? t - 1 : t)), delay);

  useEffect(() => {
    if (timeToAnswer === 0) onTimeout();
  }, [timeToAnswer]);

  return (
    <div className="training-timer">
      <TimerI />
      <span className="text">{fancyTimerTime(timeToAnswer)}</span>
    </div>
  );
};
