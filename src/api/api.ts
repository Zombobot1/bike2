import { axi, axif } from './axi'
import { CardDTOs, CardDTOsP, UserCardAnswerDTO } from '../components/study/training/types'
import { queryfy } from '../utils/utils'
import { str } from '../utils/types'
import { TrainingDTO, TrainingsGroupDTOs } from '../components/study/training/training/training'
import { UBlockPostDTO, UBlockPatchDTO, UBlockGetDTO, FileUploadRDTO } from '../components/ucomponents/types'

export const FILES = '/files/'
export const TRAININGS = '/trainings/'
export const CARDS = '/decks/cards/'
export const ESTIMATE_ANSWER = '/estimate-answer/'
export const SUBSCRIBE = '/subscribe/'
export const UBLOCKS = '/ublocks/'

export const api = {
  estimateAnswer: (dto: UserCardAnswerDTO): CardDTOsP => axi<CardDTOs>(queryfy(ESTIMATE_ANSWER, dto)),

  deleteCard: (id: str) => axi(CARDS + id, 'DELETE'),

  deleteUBlock: (id: str) => axi(UBLOCKS + id, 'DELETE'),
  postUBlock: (data: UBlockPostDTO) => axi(UBLOCKS, data),
  patchUBlock: (id: str, data: UBlockPatchDTO) => axi(UBLOCKS + id, data, 'PATCH'),
  getUBlock: (id: str) => axi<UBlockGetDTO>(UBLOCKS + id),

  uploadFile: (file: File) => axif<FileUploadRDTO>(FILES, file),
  deleteFile: (id: str) => axi(FILES + id, 'DELETE'),

  getTrainings: () => axi<TrainingsGroupDTOs>(TRAININGS),
  getNextTraining: async (id: str): Promise<TrainingDTO | undefined> => {
    const groups = await axi<TrainingsGroupDTOs>(TRAININGS)
    const trainings = groups.map((g) => g.trainings).flat()
    if (trainings.length === 0) return
    if (trainings.length === 1) return trainings[0]
    return trainings.filter((t) => t._id !== id)[0]
  },
  getTraining: (id: str) => axi<TrainingDTO>(TRAININGS + id),

  subscribeForNotifications: (token: str) => axi(SUBSCRIBE, { token }),
}
