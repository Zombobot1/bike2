import { axi } from './axi'
import { CardDTOs, CardDTOsP, UserCardAnswerDTO } from '../components/study/training/types'
import { idfy, queryfy } from '../utils/utils'
import { JSObject } from '../utils/types'

export const GET_TRAININGS_GROUPS = '/trainings'
export const GET_TRAINING = '/trainings/:id'
export const CARD = '/decks/cards/:id'
export const GET_TRAINING_UPDATE_ON_ANSWER = '/estimate-answer/'
export const POST_FCM_TOKEN = '/subscribe/'

export const estimateAnswer = async (dto: UserCardAnswerDTO): CardDTOsP => {
  const update = await axi.get(queryfy(GET_TRAINING_UPDATE_ON_ANSWER, dto)).then((res) => res.data)
  return update as CardDTOs
}

export const deleteCard = (id: string) => axi.delete(idfy(CARD, id)).then((res) => res.data)
export const patchCard = (id: string, patch: JSObject) => axi.patch(idfy(CARD, id), patch).then((res) => res.data)

export const getTrainings = () => axi.get(GET_TRAININGS_GROUPS).then((res) => res.data)

export const getTraining = (id: string) => axi.get(idfy(GET_TRAINING, id)).then((res) => res.data)

export const subscribeForNotifications = (token: string) => axi.post(POST_FCM_TOKEN, { token }).then((res) => res.data)
