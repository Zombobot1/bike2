import React from 'react';
import RegularTrainings from '../study/regular-trainings';
import { training, Training } from './_sandbox/_sandbox';

export const Study = () => {
  return (
    <div className="study">
      <RegularTrainings />
    </div>
  );
};

export const StudyTraining = () => (
  <div className="study-training">
    <Training {...training} />
  </div>
);
