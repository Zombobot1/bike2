import { CardEstimation, CardType, estimationColor } from '../types';
import { useState } from 'react';
import { COLORS } from '../../../../theme';
import { TrainingControls } from './training-controls';
import { useTrainingTimer } from '../training-timer/training-timer';
import { useMount } from '../../../../utils/hooks-utils';
import { Button, Stack, Typography } from '@material-ui/core';

interface TrainingControlsTP {
  cardType: CardType;
  areFieldsHidden: boolean;
  timeLeft: number;
}

const TrainingControlsT = ({ cardType, areFieldsHidden, timeLeft }: TrainingControlsTP) => {
  const [areHidden, setHidden] = useState(areFieldsHidden);
  const [estimation, setEstimation] = useState<CardEstimation | null>(null);
  const [status, setStatus] = useState('');

  const [isTimeOut, setIsTimeOut] = useState(false);
  const [wasDeleted, setWasDeleted] = useState(false);
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
            setIsTimeOut(false);
            setTimeToAnswer(timeLeft);
          }}
        >
          Timeout! Relaunch
        </Button>
      )}
      {status && <h3>{status}</h3>}
      {estimation && <h3 style={{ color: estimationColor(estimation) }}>{estimation}</h3>}
      <TrainingControls
        cardType={cardType}
        showHiddenFields={() => setHidden(false)}
        areFieldsHidden={areHidden}
        estimate={cardType === 'PASSIVE' ? estimatePassive : estimateInteractive}
        currentCardIndex={0}
        deleteCard={() => setWasDeleted(true)}
        cardId="1"
      />
    </Stack>
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

export const PassiveCardControls = () => <TrainingControlsT {...passiveCardControls} />;
export const InteractiveCardControls = () => <TrainingControlsT {...interactiveCardControls} />;
export const AtTimeout = () => <TrainingControlsT {...atTimeout} />;
export const CanDeleteCard = () => <TrainingControlsT {...passiveCardControls} />;
export const CanPauseOrResumeTimer = () => <TrainingControlsT {...passiveCardControls} />;
