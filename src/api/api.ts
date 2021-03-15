import { axi } from './axi';
import { CardT } from '../components/study/training/types';

export const estimateAnswer = async (trainingId: string, cardId: string, estimation: number) => {
  const update = await axi
    .get(`/trainings/${trainingId}/answers?id=${cardId}&estimation=${estimation}`)
    .then((res) => res.data);
  return update as CardT[];
};

export const getTrainings = () => axi.get('/trainings').then((res) => res.data);

export const getTraining = (id: string) => axi.get(`/trainings/${id}`).then((res) => res.data);

export const deleteTraining = (id: string) => axi.delete(`/trainings/${id}`).then((res) => res.data);
