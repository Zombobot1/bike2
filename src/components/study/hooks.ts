import { useQuery } from 'react-query';
import { TrainingDeckHeadingBaseP } from './training-deck/training-deck-heading';
import { TrainingP } from './training/training';
import { getTrainings, getTraining } from '../../api/api';

export const useTrainings = () => useQuery<TrainingDeckHeadingBaseP[], Error>('trainings', () => getTrainings());

export const useTraining = (id: string) =>
  useQuery<TrainingP, Error, TrainingP>(['trainings', id], () => getTraining(id));
