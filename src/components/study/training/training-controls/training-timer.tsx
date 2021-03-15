import React, { useEffect } from 'react';
import { ReactComponent as TimerI } from '../../../icons/hourglass-split.svg';
import { useInterval } from '../../../utils/hooks/use-interval';
import { fancyTimerTime } from '../../../../utils/formatting';
import { StateT } from '../../../forms/hoc/with-validation';

export interface TrainingTimerP {
  secsLeftS: StateT<number>;
  onTimeout: () => void;
}

export const TrainingTimer = ({ secsLeftS, onTimeout }: TrainingTimerP) => {
  const [secsLeft, setSecsLeft] = secsLeftS;
  useInterval(() => setSecsLeft((s) => s - 1), 1000);
  useEffect(() => {
    if (secsLeft < 0) onTimeout();
  }, [secsLeft]);
  return (
    <div className="timer">
      <TimerI />
      <span className="text">{fancyTimerTime(secsLeft)}</span>
    </div>
  );
};
