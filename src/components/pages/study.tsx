import React from 'react';
import RegularTrainings from '../study/regular-trainings';
import { TrainingContainer } from '../study/training/training-container/training-container';

export const Study = () => {
  return (
    <div className="study">
      <RegularTrainings />
    </div>
  );
};

export const StudyTraining = () => <TrainingContainer />;
