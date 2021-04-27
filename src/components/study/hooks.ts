import { useQuery } from 'react-query';
import { TrainingsGroupDTO } from './training-deck/training-deck-heading';
import { TrainingDTO } from './training/training';
import { getTrainings, getTraining } from '../../api/api';

export const useTrainings = () => useQuery<TrainingsGroupDTO[], Error>('trainings', () => getTrainings());

export const useTraining = (id: string) =>
  useQuery<TrainingDTO, Error, TrainingDTO>(['trainings', id], () => getTraining(id));
