import { COLORS } from '../../application/theming/theme'
import { num, str } from '../../../utils/types'
import { UBlockType } from '../../editing/UPage/ublockTypes'

export type CardEstimation = 'POOR' | 'BAD' | 'GOOD' | 'EASY'
const WEIGHTS: { [K in CardEstimation]: number } = {
  EASY: 2,
  GOOD: 1,
  POOR: 0,
  BAD: -1,
}
export const isMistake = (e: CardEstimation) => ['POOR', 'BAD'].includes(e)
export const cardEstimationToNumber = (a: CardEstimation): number => WEIGHTS[a]
export const estimationColor = (e: CardEstimation) => {
  switch (e) {
    case 'BAD':
      return COLORS.error
    case 'GOOD':
      return COLORS.success
    case 'POOR':
      return COLORS.warning
    case 'EASY':
      return COLORS.info
  }
}

export interface FieldDTO {
  _id: str
  data: str
  type: UBlockType
}

export type FieldDTOs = FieldDTO[]

export interface CardDTO {
  _id: str
  fields: FieldDTOs
  hiddenFields?: FieldDTOs
  stageColor: str
  timeToAnswer: num
}

export type CardDTOs = CardDTO[]
export type CardDTOsP = Promise<CardDTOs>

export type CardType = 'passive' | 'interactive'

export interface UserCardAnswerDTO {
  deckId: string
  cardId: string
  estimation: CardEstimation
}
