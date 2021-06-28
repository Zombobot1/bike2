import React from 'react';
import RegularTrainings from './components/study/regular-trainings';
import { TrainingContainer } from './components/study/training/training-container';

export const Study = () => {
  return (
    <div className="study">
      <RegularTrainings />
    </div>
  );
};

export const StudyTraining = () => <TrainingContainer />;
