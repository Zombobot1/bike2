import React from 'react';
import RegularTrainings from '../study/regular-trainings';
import { training, Training, TrainingContainer } from './_sandbox/_sandbox';

export const Study = () => {
  return (
    <div className="study">
      <RegularTrainings />
    </div>
  );
};

export const StudyTraining = () => <TrainingContainer />;
