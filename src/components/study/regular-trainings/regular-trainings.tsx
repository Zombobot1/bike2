import './regular-trainings.scss';
import TrainingsHeading from '../trainings-heading';
import { Trainings } from '../trainings';
import React from 'react';

const RegularTrainings = () => (
  <div className="d-flex regular-trainings">
    <div>
      <TrainingsHeading />
      <Trainings />
    </div>
  </div>
);

export default RegularTrainings;
