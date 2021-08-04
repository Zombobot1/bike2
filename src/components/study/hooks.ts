import { useQuery } from 'react-query'
import { TrainingDTO } from './training/training/training'
import { api } from '../../api/api'

export const useTrainings = () => useQuery('trainings', api.getTrainings)

export const useTraining = (id: string) =>
  useQuery<TrainingDTO, Error, TrainingDTO>(['trainings', id], () => api.getTraining(id), {
    refetchOnWindowFocus: false,
    cacheTime: 1, // https://github.com/tannerlinsley/react-query/issues/2367
  })
