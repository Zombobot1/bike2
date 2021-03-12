import React, { useEffect } from 'react';
import { ReactComponent as TimerI } from '../../../icons/hourglass-split.svg';
import { useEffectedState } from '../../../utils/hooks/use-effected-state';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';

export interface TrainingTimerP {
  timeout: { sec: number };
  onTimeout: () => void;
}

export const TrainingTimer = ({ timeout, onTimeout }: TrainingTimerP) => {
  const [secsLeft, setSecsLeft] = useEffectedState(timeout);
  useInterval(() => setSecsLeft((s) => ({ sec: s.sec - 1 })), 1000);
  useEffect(() => {
    if (secsLeft.sec < 0) onTimeout();
  }, [secsLeft]);
  return (
    <div className="timer">
      <TimerI />
      <span className="text">{fancyTimerTime(secsLeft.sec)}</span>
    </div>
  );
};
