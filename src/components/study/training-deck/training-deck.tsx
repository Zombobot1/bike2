import './training-deck.scss';
import { rnd } from '../../../utils/utils';
import React from 'react';
import TrainingCard from '../../cards/training-card';
import TrainingDeckHeading from './training-deck-heading/training-deck-heading';
import { TrainingsGroupDTO } from '../training/training/training';

export interface NamedDeck {
  deckName: string;
}

const TrainingDeck = ({ rootDeckName, trainings }: TrainingsGroupDTO) => {
  const collapseId = `c${rnd(1e3)}`;
  return (
    <div className="training-deck mb-3">
      <TrainingDeckHeading rootDeckName={rootDeckName} />
      <div className="collapse show" id={collapseId}>
        <div>
          <div className="d-flex flex-column cards">
            {trainings.map((e, i) => (
              <TrainingCard {...e} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDeck;
