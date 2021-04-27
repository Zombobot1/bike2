import './training-deck.scss';
import { rnd } from '../../../utils/utils';
import React, { useEffect, useState } from 'react';
import TrainingCard from '../../cards/training-card';
import TrainingDeckHeading, { TrainingsGroupDTO } from './training-deck-heading';
import { StateT } from '../../forms/hoc/with-validation';

export interface NamedDeck {
  deckName: string;
}

export const useEffectedState = <T,>(init: T): StateT<T> => {
  const [state, setState] = useState(init);
  useEffect(() => setState(init), [init]);
  return [state, setState];
};

const TrainingDeck = ({ rootDeckName, trainings }: TrainingsGroupDTO) => {
  const [displayedTrainings, setDisplayedTrainings] = useEffectedState(trainings);
  const collapseId = `c${rnd(1e3)}`;
  console.log('TrainingDeck rootDeckName', rootDeckName);
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
