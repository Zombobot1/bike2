import { Stack } from '@material-ui/core';
import { COLORS } from '../../../../theme';
import { useMount } from '../../../../utils/hooks-utils';
import { TrainingTimer, useTrainingTimer } from './training-timer';

interface TrainingTimerT {
  isTimerRunning: boolean;
  initialTimeToAnswer: number;
}

function TrainingTimerT({ initialTimeToAnswer, isTimerRunning }: TrainingTimerT) {
  const { setTimeToAnswer, pause, resume } = useTrainingTimer();

  useMount(() => {
    setTimeToAnswer(initialTimeToAnswer);
    if (!isTimerRunning) pause();
    else resume();
  });

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ width: 100, height: 100, backgroundColor: COLORS.light }}>
      <TrainingTimer />
    </Stack>
  );
}

const hasEnoughTime: TrainingTimerT = {
  isTimerRunning: true,
  initialTimeToAnswer: 99,
};

const lacksOfTime: TrainingTimerT = {
  isTimerRunning: true,
  initialTimeToAnswer: 5,
};

const puased: TrainingTimerT = {
  isTimerRunning: false,
  initialTimeToAnswer: 50,
};

const lacksOfTimeAndPaused: TrainingTimerT = {
  isTimerRunning: false,
  initialTimeToAnswer: 5,
};

export const STrainingTimer = {
  hasEnoughTime: () => <TrainingTimerT {...hasEnoughTime} />,
  lacksOfTime: () => <TrainingTimerT {...lacksOfTime} />,
  puased: () => <TrainingTimerT {...puased} />,
  lacksOfTimeAndPaused: () => <TrainingTimerT {...lacksOfTimeAndPaused} />,
};
