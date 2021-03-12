import './training-header.scss';
import { COLORS } from '../../../../config';
import React from 'react';
import { ProgressBar } from '../../../controls/progress-bar';
import { FullScreenTrigger } from '../../../utils/full-screen-trigger';
import { fancyTime } from '../../../../utils/formatting';
import { TrainingSettings } from '../training-controls/training-settings';
import { CardT, TrainingType } from '../types';

export interface TrainingHeaderP {
  type: TrainingType;
  deckName: string;
  cards: CardT[];
  currentCardNumber: number;
}

export const TrainingHeader = ({ cards, deckName, type, currentCardNumber }: TrainingHeaderP) => {
  const timeToFinish = cards.slice(currentCardNumber).reduce((p, e) => p + e.timeout, 0);
  return (
    <>
      <h3 className="header">{(type === TrainingType.Learning ? 'Learning ' : 'Training ') + deckName}</h3>
      <div className="d-flex align-items-center heading">
        <ProgressBar
          className="align-self-center me-2"
          value={currentCardNumber / cards.length}
          color={COLORS.tertiary}
        />
        <span className="align-self-center me-auto cards-left-info">{fancyTime(timeToFinish)} left.</span>
        <FullScreenTrigger />
        <TrainingSettings />
      </div>
    </>
  );
};
