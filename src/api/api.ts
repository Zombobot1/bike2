import { axi } from './axi'
import { CardDTOs, CardDTOsP, UserCardAnswerDTO } from '../components/study/training/types'
import { queryfy } from '../utils/utils'
import { str } from '../utils/types'
import { TrainingDTO, TrainingsGroupDTOs } from '../components/study/training/training/training'
import {
  StrBlockPostDTO,
  StrBlockPutDTO,
  StrBlockGetDTO,
  StrBlockPostRDTO,
  FileUploadRDTO,
} from '../components/ucomponents/types'

export const FILES = '/files/'
export const TRAININGS = '/trainings/'
export const CARDS = '/decks/cards/'
export const ESTIMATE_ANSWER = '/estimate-answer/'
export const SUBSCRIBE = '/subscribe/'
export const UBLOCKS = '/ublocks/'

export const api = {
  estimateAnswer: async (dto: UserCardAnswerDTO): CardDTOsP => {
    const update = await axi.get(queryfy(ESTIMATE_ANSWER, dto)).then((res) => res.data)
    return update as CardDTOs
  },

  deleteCard: (id: str) => axi.delete(CARDS + id),

  postStrBlock: (data: StrBlockPostDTO) => axi.post(UBLOCKS, data).then((res) => res.data as StrBlockPostRDTO),
  putStrBlock: (id: str, data: StrBlockPutDTO) => axi.put(UBLOCKS + id, data).then((res) => res.data),
  getStrBlock: (id: str) => axi.get(UBLOCKS + id).then((res) => res.data as StrBlockGetDTO),

  uploadFile(file: File) {
    const form = new FormData()
    form.append('file', file)
    return axi
      .post(FILES, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data as FileUploadRDTO)
  },
  deleteFile: (id: str) => axi.delete(FILES + id),

  getTrainings: () => axi.get(TRAININGS).then((res) => res.data),
  getNextTraining: async (id: str): Promise<TrainingDTO | undefined> => {
    const groups = (await axi.get(TRAININGS).then((res) => res.data)) as TrainingsGroupDTOs
    const trainings = groups.map((g) => g.trainings).flat()
    if (trainings.length === 0) return
    if (trainings.length === 1) return trainings[0]
    return trainings.filter((t) => t._id !== id)[0]
  },
  getTraining: (id: str) => axi.get(TRAININGS + id).then((res) => res.data),

  subscribeForNotifications: (token: str) => axi.post(SUBSCRIBE, { token }).then((res) => res.data),
}
