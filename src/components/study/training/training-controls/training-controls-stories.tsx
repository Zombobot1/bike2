import { CardEstimation, CardType, estimationColor } from '../types';
import React, { useState } from 'react';
import { COLORS } from '../../../../config';
import { TrainingControls } from './training-controls';
import { useTrainingTimer } from '../training-timer/training-timer';
import { useMount } from '../../../../utils/hooks-utils';

interface TrainingControlsTP {
  cardType: CardType;
  areFieldsHidden: boolean;
  timeLeft: number;
}

export const TrainingControlsT = ({ cardType, areFieldsHidden, timeLeft }: TrainingControlsTP) => {
  const [areHidden, setHidden] = useState(areFieldsHidden);
  const [estimation, setEstimation] = useState<CardEstimation | null>(null);
  const [status, setStatus] = useState('');

  const [isTimeOut, setIsTimeOut] = useState(false);
  const { setTimeToAnswer, setOnTimeout } = useTrainingTimer();

  useMount(() => {
    setOnTimeout(() => setIsTimeOut(true));
    setTimeToAnswer(timeLeft);
  });

  const estimatePassive = (e: CardEstimation) => {
    setEstimation(e);
    setHidden(true);
    return undefined;
  };

  const estimateInteractive = (_e: CardEstimation) => {
    setStatus('Ready to go further');
    return () => setStatus('This is next');
  };

  return (
    <div
      className="d-flex flex-column align-items-center pt-3 pb-3"
      style={{ width: '500px', backgroundColor: COLORS.light }}
    >
      {isTimeOut && (
        <button
          className="btn btn-outline-danger mb-3"
          onClick={() => {
            setIsTimeOut(false);
            setTimeToAnswer(timeLeft);
          }}
        >
          Timout! Relaunch
        </button>
      )}
      {status && <h3 className="mb-3">{status}</h3>}
      {estimation && (
        <h3 className="mb-3" style={{ color: estimationColor(estimation) }}>
          {estimation}
        </h3>
      )}
      <TrainingControls
        cardType={cardType}
        showHiddenFields={() => setHidden(false)}
        areFieldsHidden={areHidden}
        estimate={cardType === 'PASSIVE' ? estimatePassive : estimateInteractive}
        currentCardIndex={0}
      />
    </div>
  );
};

const passiveCardControls: TrainingControlsTP = {
  cardType: 'PASSIVE',
  areFieldsHidden: true,
  timeLeft: 99,
};

const interactiveCardControls: TrainingControlsTP = {
  cardType: 'INTERACTIVE',
  areFieldsHidden: true,
  timeLeft: 99,
};

const atTimeout: TrainingControlsTP = {
  cardType: 'INTERACTIVE',
  areFieldsHidden: true,
  timeLeft: 1,
};

export const STrainingControls = {
  PassiveCardControls: () => <TrainingControlsT {...passiveCardControls} />,
  InteractiveCardControls: () => <TrainingControlsT {...interactiveCardControls} />,
  AtTimeout: () => <TrainingControlsT {...atTimeout} />,
};
