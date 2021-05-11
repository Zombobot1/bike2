import React, { useEffect, useState } from 'react';
import { ReactComponent as TimerI } from '../../../icons/hourglass-split.svg';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';
import { NumStateT } from '../../../../utils/types';

export interface TrainingTimerP {
  onTimeout: () => void;
  timeToAnswerS: NumStateT;
  isRunning?: boolean;
}

export const TrainingTimer = ({ onTimeout, timeToAnswerS, isRunning = true }: TrainingTimerP) => {
  const [timeToAnswer, setTimeToAnswer] = timeToAnswerS;
  const [delay, setDelay] = useState(1e3);

  useEffect(() => setDelay(isRunning ? 1e3 : 1e9), [isRunning]);

  useInterval(() => setTimeToAnswer((t) => (t > 0 ? t - 1 : t)), delay);

  useEffect(() => {
    if (timeToAnswer === 0) onTimeout();
  }, [timeToAnswer]);

  return (
    <div className="timer">
      <TimerI />
      <span className="text">{fancyTimerTime(timeToAnswer)}</span>
    </div>
  );
};
