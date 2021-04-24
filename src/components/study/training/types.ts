export type CardEstimation = 'BAD' | 'POOR' | 'GOOD' | 'EASY';

export type CardSide = 'FRONT' | 'BACK';

export interface FieldP {
  type: 'PRE' | 'IMG' | 'AUDIO';
  data: string;
}

export interface FieldT extends FieldP {
  side: CardSide;
}

export interface CardDTO {
  _id: string;
  fields: FieldT[];
  timeToLearn: number;
  stageColor: string;
  priority: number;
}

export interface TrainingMetaInfo {
  highestPriority: string;
  updatedAt: string;
}

export interface UserCardAnswerDTO extends TrainingMetaInfo {
  deckId: string;
  cardId: string;
  estimation: CardEstimation;
}

export interface TrainingUpdateDTO extends TrainingMetaInfo {
  cards: CardDTO[];
}

export type TrainingUpdateDTOP = Promise<TrainingUpdateDTO>;
