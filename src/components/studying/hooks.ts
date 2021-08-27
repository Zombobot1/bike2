import { useQuery } from 'react-query'
import { TrainingDTO, TrainingsGroupDTOs } from './training/training/training'
import { api } from '../../api/api'
import { useState } from 'react'
import { useMount } from '../utils/hooks/hooks'

export function useTrainings() {
  const [data, setData] = useState<TrainingsGroupDTOs>([])
  useMount(() => {
    api.getTrainings().then(setData)
  })
  return { data }
}

export const useTraining = (id: string) =>
  useQuery<TrainingDTO, Error, TrainingDTO>(['trainings', id], () => api.getTraining(id), {
    refetchOnWindowFocus: false,
    cacheTime: 1, // https://github.com/tannerlinsley/react-query/issues/2367
  })
