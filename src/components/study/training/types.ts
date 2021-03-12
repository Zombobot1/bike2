export enum TrainingType {
  Learning,
  Repeating,
}

export enum AnswerEstimation {
  Bad,
  Poor,
  Good,
  Easy,
}

export interface CardT {
  id: string;
  question: string;
  answer: string;
  timeout: number;
  stageColor: string;
}
