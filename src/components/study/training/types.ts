import { COLORS } from '../../../config';

export type CardEstimation = 'SOSO' | 'BAD' | 'GOOD' | 'EASY';
const WEIGHTS: { [K in CardEstimation]: number } = {
  EASY: 2,
  GOOD: 1,
  SOSO: 0,
  BAD: -1,
};
export const cardEstimationToNumber = (a: CardEstimation): number => WEIGHTS[a];
export const estimationColor = (e: CardEstimation) => {
  switch (e) {
    case 'BAD':
      return COLORS.danger;
    case 'GOOD':
      return COLORS.success;
    case 'SOSO':
      return COLORS.warning;
    case 'EASY':
      return COLORS.info;
  }
};

export type FieldState = 'HIDE' | 'SHOW';
export type FieldType = 'PRE' | 'IMG' | 'AUDIO' | 'RADIO' | 'INPUT' | 'CHECKS';

export interface Question {
  question: string;
  correctAnswer: string[];
  explanation: string;
  options: string[];
}

export interface FieldDTO {
  _id: string;
  type: FieldType;
  status: FieldState;
  passiveData?: string;
  interactiveData?: Question;
}

export type CardType = 'PASSIVE' | 'INTERACTIVE';

export interface CardDTO {
  _id: string;
  fields: FieldDTO[];
  timeToAnswer: number;
  stageColor: string;
  type: CardType;
}

export type CardDTOs = CardDTO[];
export type CardDTOsP = Promise<CardDTOs>;

export interface UserCardAnswerDTO {
  deckId: string;
  cardId: string;
  estimation: CardEstimation;
}
