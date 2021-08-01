import { useQuery } from 'react-query'
import { TrainingDTO } from './training/training/training'
import { getTrainings, getTraining } from '../../api/api'
import { TrainingsGroupDTO } from './training/training/training'

export const useTrainings = () => useQuery<TrainingsGroupDTO[], Error>('trainings', () => getTrainings())

export const useTraining = (id: string) =>
  useQuery<TrainingDTO, Error, TrainingDTO>(['trainings', id], () => getTraining(id), {
    refetchOnWindowFocus: false,
    cacheTime: 1, // https://github.com/tannerlinsley/react-query/issues/2367
  })
