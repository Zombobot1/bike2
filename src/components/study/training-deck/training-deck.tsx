import './training-deck.scss';
import React from 'react';
import { TrainingCard } from '../training-card/training-card';
import { TrainingsGroupDTO } from '../training/training/training';
import { chop } from '../utils';
import { Typography, Stack, styled } from '@material-ui/core';
import { useMQ } from '../../../utils/hooks-utils';

export interface NamedDeck {
  deckName: string;
}

const Card = styled('div')(({ theme }) => ({
  padding: '12px 16px 20px 16px',
  backgroundColor: theme.palette.common.white,
  border: `0.5px solid ${theme.palette.grey['200']}`,
  borderRadius: 16,
  marginBottom: '20px',
}));

export const TrainingDeck = ({ rootDeckName, trainings }: TrainingsGroupDTO) => {
  const sx = useMQ({ width: 320 }, { width: '100%' });

  return (
    <Card sx={sx}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {chop(rootDeckName, 10)}
      </Typography>
      <Stack spacing={2}>
        {trainings.map((e, i) => (
          <TrainingCard {...e} key={i} />
        ))}
      </Stack>
    </Card>
  );
};
