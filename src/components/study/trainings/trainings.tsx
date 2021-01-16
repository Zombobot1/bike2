import './trainings.scss';
import { useCurrentWidth } from '../hooks';
import React, { useEffect, useState } from 'react';
import { range } from 'lodash';
import { cn } from '../../../utils/utils';
import { eachNth } from '../utils';
import TrainingDeck from '../training-deck';
import { useInfo } from '../../info-provider';

const Trainings = () => {
  const decks = useInfo().study.trainingDecks;
  const widthAndColumnNumbers = new Map<number, number>([
    [1200, 3],
    [850, 2],
    [500, 1],
  ]);
  const currentWidth = useCurrentWidth(Array.from(widthAndColumnNumbers.keys()));
  const selectColumnNumber = () => widthAndColumnNumbers.get(currentWidth) || 0;
  const [columnNumber, setColumnNumber] = useState(selectColumnNumber());
  useEffect(() => setColumnNumber(selectColumnNumber()), [currentWidth]);
  return (
    <div className="d-flex decks-to-train">
      {range(columnNumber).map((i) => (
        <div className={cn({ 'me-3': i !== columnNumber - 1 })} key={i}>
          {eachNth(decks, columnNumber, i).map((e, j) => (
            <TrainingDeck {...e} key={j} />
          ))}
        </div>
      ))}
      <div className="w-100 trainings-footer" />
    </div>
  );
};

export default Trainings;
