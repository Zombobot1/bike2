import { COLORS } from '../../../theme'
import { bool, str } from '../../../utils/types'

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
      return COLORS.danger
    case 'GOOD':
      return COLORS.success
    case 'POOR':
      return COLORS.warning
    case 'EASY':
      return COLORS.info
  }
}

export type FieldState = 'HIDE' | 'SHOW'
export type FieldType = 'PRE' | 'IMG' | 'AUDIO' | 'RADIO' | 'INPUT' | 'CHECKS'
export const isPassive = (t: FieldType) => ['PRE', 'IMG', 'AUDIO'].includes(t)

export interface Question {
  question: string
  correctAnswer: string[]
  explanation: string
  options: string[]
}

export interface FieldInformationDTO {
  _id?: str
  name: str
  type: FieldType
  isPreview: bool
}
export type FieldInformationDTOs = FieldInformationDTO[]

export interface FieldDTO extends FieldInformationDTO {
  status: FieldState
  passiveData?: string
  interactiveData?: Question
}
export type FieldDTOs = FieldDTO[]

export type CardType = 'PASSIVE' | 'INTERACTIVE'

export interface CardDTO {
  _id: string
  fields: FieldDTOs
  timeToAnswer: number
  stageColor: string
  type: CardType
}

export type CardDTOs = CardDTO[]
export type CardDTOsP = Promise<CardDTOs>

export interface UserCardAnswerDTO {
  deckId: string
  cardId: string
  estimation: CardEstimation
}
