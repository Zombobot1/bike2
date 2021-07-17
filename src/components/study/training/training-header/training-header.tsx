import { addS, fancyTime } from '../../../../utils/formatting';
import { LinearProgress, Stack, styled, Typography } from '@material-ui/core';
import { useIsSM } from '../../../../utils/hooks-utils';

export interface ProgressBarP {
  value: number;
}

const Progress = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
  marginRight: 10,
  '& .MuiLinearProgress-bar': { borderRadius: 5 },
});

const ProgressBar = ({ value }: ProgressBarP) => {
  const isSM = useIsSM();
  const sx = { width: isSM ? 320 : 220, marginRight: 2 };
  return <Progress value={value} sx={sx} variant="determinate" color="success" />;
};

export interface TrainingHeaderP {
  timeToFinish: number;
  cardsLength: number;
  currentCardIndex: number;
}

const cardsLeftInfo = (cardsLength: number, currentCardIndex: number, timeToFinish: number) => {
  const cardsLeftNumber = cardsLength - currentCardIndex;
  const cardsLeft = `${cardsLeftNumber} card${addS(cardsLeftNumber)}`;
  if (cardsLeftNumber < 100 || timeToFinish < 60 * 60) return `${cardsLeft} ~ ${fancyTime(timeToFinish)}`;
  return `${cardsLeft} ~ ${fancyTime(timeToFinish, true)}`;
};

const CardsLeft = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 14,
}));

export const TrainingHeader = ({ timeToFinish, cardsLength, currentCardIndex }: TrainingHeaderP) => {
  const progress = (currentCardIndex / cardsLength) * 100;

  return (
    <Stack direction="row" alignItems="center">
      <ProgressBar value={progress} />
      <CardsLeft>{cardsLeftInfo(cardsLength, currentCardIndex, timeToFinish)}</CardsLeft>
    </Stack>
  );
};
