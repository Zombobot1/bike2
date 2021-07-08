import React from 'react';
import { Trainings } from '../study/regular-trainings/regular-trainings';
import { TrainingWrapper } from '../study/training/training/training';

export const Study = () => {
  return (
    <div className="study">
      <Trainings />
    </div>
  );
};

export const StudyTraining = () => <TrainingWrapper />;
