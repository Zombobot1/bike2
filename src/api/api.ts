import { axi } from './axi';
import { CardDTOs, CardDTOsP, UserCardAnswerDTO } from '../components/study/training/types';
import { idfy, queryfy } from '../utils/utils';

export const GET_TRAININGS_GROUPS = '/trainings';
export const GET_TRAINING = '/trainings/:id';
export const GET_TRAINING_UPDATE_ON_ANSWER = '/estimate-answer/';

export const estimateAnswer = async (dto: UserCardAnswerDTO): CardDTOsP => {
  const update = await axi.get(queryfy(GET_TRAINING_UPDATE_ON_ANSWER, dto)).then((res) => res.data);
  return update as CardDTOs;
};

export const getTrainings = () => axi.get(GET_TRAININGS_GROUPS).then((res) => res.data);

export const getTraining = (id: string) => axi.get(idfy(GET_TRAINING, id)).then((res) => res.data);
