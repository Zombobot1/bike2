export enum AnswerEstimation {
  Bad,
  Poor,
  Good,
  Easy,
}

export type CardSide = 'FRONT' | 'BACK';

export interface FieldP {
  type: 'PRE' | 'IMG' | 'AUDIO';
  data: string;
}

export interface FieldT extends FieldP {
  side: CardSide;
}

export interface CardT {
  id: string;
  fields: FieldT[];
  timeout: number;
  stageColor: string;
  priority: number;
}
