import './regular-trainings.scss';
import { Trainings } from '../trainings';
import React from 'react';

const RegularTrainings = () => (
  <div className="d-flex regular-trainings">
    <div>
      <h2 className="page-header">Regular trainings</h2>
      <Trainings />
    </div>
  </div>
);

export default RegularTrainings;
