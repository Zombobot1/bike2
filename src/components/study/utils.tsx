import { TrainingCardP } from '../cards/training-card';
import { TrainingCardsInfoP } from '../cards/training-cards-info';

export const eachNth = <T,>(arr: T[], n: number, from: number): T[] => arr.slice(from).filter((e, i) => i % n === 0);

export const totalToRepeatAndToLearn = (trainings: TrainingCardP[]): TrainingCardsInfoP => {
  const toLearn = trainings.reduce((p, e) => p + e.trainingCardsInfo.toLearn, 0);
  const toRepeat = trainings.reduce((p, e) => p + e.trainingCardsInfo.toRepeat, 0);
  return { toLearn, toRepeat };
};

export const chop = (str: string, size: number): string => {
  if (str.length < size) return str;
  return str.slice(0, size) + '...';
};
