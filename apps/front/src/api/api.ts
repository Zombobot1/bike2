import { axi } from './axi'
import { CardDTOs, CardDTOsP, UserCardAnswerDTO } from '../components/study/training/types'
import { idfy, queryfy } from '../utils/utils'
import { str } from '../utils/types'
import { TrainingDTO, TrainingsGroupDTOs } from '../components/study/training/training/training'
import {
  StrBlockPostDTO,
  StrBlockPutDTO,
  StrBlockGetDTO,
  StrBlockPostResponseDTO,
} from '../components/ucomponents/types'

export const GET_TRAININGS_GROUPS = '/trainings'
export const GET_TRAINING = '/trainings/:id'
export const CARD = '/decks/cards/:id'
export const GET_TRAINING_UPDATE_ON_ANSWER = '/estimate-answer/'
export const POST_FCM_TOKEN = '/subscribe/'
export const UBLOCKS = '/ublocks/'
export const UBLOCK = '/ublocks/:id'

export const estimateAnswer = async (dto: UserCardAnswerDTO): CardDTOsP => {
  const update = await axi.get(queryfy(GET_TRAINING_UPDATE_ON_ANSWER, dto)).then((res) => res.data)
  return update as CardDTOs
}

export const deleteCard = (id: str) => axi.delete(idfy(CARD, id)).then((res) => res.data)

export const postStrBlock = (data: StrBlockPostDTO) =>
  axi.post(UBLOCKS, data).then((res) => res.data as StrBlockPostResponseDTO)
export const putStrBlock = (id: str, data: StrBlockPutDTO) => axi.put(idfy(UBLOCK, id), data).then((res) => res.data)
export const getStrBlock = (id: str) => axi.get(idfy(UBLOCK, id)).then((res) => res.data as StrBlockGetDTO)

export const getTrainings = () => axi.get(GET_TRAININGS_GROUPS).then((res) => res.data)
export const getNextTraining = async (id: str): Promise<TrainingDTO | undefined> => {
  const groups = (await axi.get(GET_TRAININGS_GROUPS).then((res) => res.data)) as TrainingsGroupDTOs
  const trainings = groups.map((g) => g.trainings).flat()
  if (trainings.length === 0) return
  if (trainings.length === 1) return trainings[0]
  return trainings.filter((t) => t._id !== id)[0]
}

export const getTraining = (id: str) => axi.get(idfy(GET_TRAINING, id)).then((res) => res.data)

export const subscribeForNotifications = (token: str) => axi.post(POST_FCM_TOKEN, { token }).then((res) => res.data)
