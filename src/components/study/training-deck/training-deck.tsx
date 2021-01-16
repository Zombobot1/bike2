import './training-deck.scss';
import { rnd } from '../../../utils/utils';
import React, { useState } from 'react';
import TrainingCard from '../../cards/training-card';
import TrainingDeckHeading, { TrainingDeckHeadingBaseP } from './training-deck-heading';

export interface NamedDeck {
  deckName: string;
}

const TrainingDeck = ({ deckName, trainings }: TrainingDeckHeadingBaseP) => {
  const [displayedTrainings, setDisplayedTrainings] = useState(trainings);
  const collapseId = `c${rnd(1e3)}`;
  return (
    <div className="training-deck mb-3">
      <TrainingDeckHeading
        setDisplayedTrainings={setDisplayedTrainings}
        collapseId={collapseId}
        deckName={deckName}
        trainings={trainings}
      />
      <div className="collapse show" id={collapseId}>
        <div>
          <div className="d-flex flex-column cards">
            {displayedTrainings.map((e, i) => (
              <TrainingCard {...e} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDeck;
