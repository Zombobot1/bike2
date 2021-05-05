import './training-deck.scss';
import { rnd } from '../../../utils/utils';
import React from 'react';
import TrainingCard from '../../cards/training-card';
import TrainingDeckHeading, { TrainingsGroupDTO } from './training-deck-heading';
import { useRQState } from '../../../utils/hooks-utils';

export interface NamedDeck {
  deckName: string;
}

const TrainingDeck = ({ rootDeckName, trainings }: TrainingsGroupDTO) => {
  const [displayedTrainings, setDisplayedTrainings] = useRQState(trainings);
  const collapseId = `c${rnd(1e3)}`;
  return (
    <div className="training-deck mb-3">
      <TrainingDeckHeading
        setDisplayedTrainings={setDisplayedTrainings}
        collapseId={collapseId}
        rootDeckName={rootDeckName}
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
