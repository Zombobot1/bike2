import './training-deck-heading.scss';
import { chop } from '../../utils';
import React from 'react';

interface TrainingDeckHeading {
  rootDeckName: string;
}

const TrainingDeckHeading = ({ rootDeckName }: TrainingDeckHeading) => {
  return (
    <div className="trainings-heading d-flex justify-content-between">
      <h3 className={'me-auto '}>{chop(rootDeckName, 10)}</h3>
    </div>
  );
};

export default TrainingDeckHeading;
