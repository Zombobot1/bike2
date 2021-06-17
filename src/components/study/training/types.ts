export type CardEstimation = 'BAD' | 'POOR' | 'GOOD' | 'EASY';
const WEIGHTS: { [K in CardEstimation]: number } = {
  EASY: 2,
  GOOD: 1,
  POOR: 0,
  BAD: -1,
};
export const cardEstimationToNumber = (a: CardEstimation): number => WEIGHTS[a];

export type FieldState = 'HIDE' | 'SHOW';
export type FieldType = 'PRE' | 'IMG' | 'AUDIO' | 'RADIO' | 'INPUT' | 'CHECKS';

export interface Question {
  question: string;
  correctAnswer: string;
  explanation: string;
  options: string[];
}

export interface FieldDTO {
  type: FieldType;
  state?: FieldState;
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
