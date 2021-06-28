import './trainings.scss';
import React from 'react';
import { range } from 'lodash';
import { cn } from '../../../utils/utils';
import { eachNth } from '../utils';
import TrainingDeck from '../training-deck';
import { useTrainings } from '../hooks';
import { useMedia } from '../../utils/hooks/use-media';
import { FetchedData } from '../../utils/hoc/fetched-data';
import { TrainingsGroupDTO } from '../training/training/training';

export const DeckColumns = (columnNumber: number) => (decks: TrainingsGroupDTO[]) => {
  return (
    <>
      {range(columnNumber).map((i) => (
        <div className={cn({ 'me-3': i !== columnNumber - 1 })} key={i}>
          {eachNth(decks, columnNumber, i).map((e, j) => (
            <TrainingDeck {...e} key={j} />
          ))}
        </div>
      ))}
      <div className="w-100 trainings-footer" />
    </>
  );
};

const MD = '(max-width: 850px)';
const LG = '(max-width: 1200px)';

export const Trainings = () => {
  const decks = useTrainings();
  const columnNumber = useMedia([MD, LG], [1, 2], 3);
  return (
    <div className="d-flex decks-to-train">
      <FetchedData Base={DeckColumns(columnNumber)} {...decks} />
    </div>
  );
};
