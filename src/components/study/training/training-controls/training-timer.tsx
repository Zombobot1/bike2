import React, { useEffect } from 'react';
import { ReactComponent as TimerI } from '../../../icons/hourglass-split.svg';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';
import { NumStateT } from '../../../forms/hoc/with-validation';

export interface TrainingTimerP {
  onTimeout: () => void;
  timeToAnswerS: NumStateT;
}

export const TrainingTimer = ({ onTimeout, timeToAnswerS }: TrainingTimerP) => {
  const [timeToAnswer, setTimeToAnswer] = timeToAnswerS;
  useInterval(() => setTimeToAnswer((t) => t - 1), 1e3);

  useEffect(() => {
    if (timeToAnswer < 0) onTimeout();
  }, [timeToAnswer]);

  return (
    <div className="timer">
      <TimerI />
      <span className="text">{fancyTimerTime(timeToAnswer)}</span>
    </div>
  );
};
