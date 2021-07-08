import { TrainingConceptsInfoP } from './training-card/training-cards-info/training-concepts-info';
import { TrainingDTO } from './training/training/training';

export const eachNth = <T,>(arr: T[], n: number, from: number): T[] => arr.slice(from).filter((e, i) => i % n === 0);

export const totalToRepeatAndToLearn = (trainings: TrainingDTO[]): TrainingConceptsInfoP => {
  const toLearn = trainings.reduce((p, e) => p + e.trainingConceptsInfo.toLearn, 0);
  const toRepeat = trainings.reduce((p, e) => p + e.trainingConceptsInfo.toRepeat, 0);
  return { toLearn, toRepeat };
};

export const chop = (str: string, size: number): string => {
  if (str.length < size) return str;
  return str.slice(0, size) + '...';
};
