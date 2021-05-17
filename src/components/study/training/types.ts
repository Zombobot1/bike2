export type CardEstimation = 'BAD' | 'POOR' | 'GOOD' | 'EASY';

export type CardSide = 'FRONT' | 'BACK';

export interface FieldTBase {
  type: 'PRE' | 'IMG' | 'AUDIO';
  data: string;
}

export interface FieldT extends FieldTBase {
  side: CardSide;
}

export interface CardDTO {
  _id: string;
  fields: FieldT[];
  timeToAnswer: number;
  stageColor: string;
  priority: number;
}

export type CardDTOs = CardDTO[];
export type CardDTOsP = Promise<CardDTOs>;

export interface UserCardAnswerDTO {
  deckId: string;
  cardId: string;
  estimation: CardEstimation;
}
