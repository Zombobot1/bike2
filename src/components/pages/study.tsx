import React from 'react';
import Trainings from '../study/trainings';
import TrainingsHeading from '../study/trainings-heading';

export const Study = () => {
  return (
    <div className="study">
      <div className="regular-trainings">
        <TrainingsHeading />
        <Trainings />
      </div>
    </div>
  );
};
