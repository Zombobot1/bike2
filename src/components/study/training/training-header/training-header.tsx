import './training-header.scss';
import { COLORS } from '../../../../config';
import React from 'react';
import { ProgressBar } from '../../../controls/progress-bar';
import { FullScreenTrigger } from '../../../utils/full-screen-trigger';
import { addS, fancyTime } from '../../../../utils/formatting';
import { TrainingSettings, TrainingSettingsP } from '../training-controls/training-settings';
import { TrainingTimer } from '../training-timer/training-timer';

export interface TrainingHeaderP extends TrainingSettingsP {
  timeToFinish: number;
  cardsLength: number;
  currentCardIndex: number;
}

export const TrainingHeader = ({ timeToFinish, cardsLength, currentCardIndex, handlers, cardId }: TrainingHeaderP) => {
  const progress = currentCardIndex / cardsLength;
  const cardsLeftNumber = cardsLength - currentCardIndex;
  const cardsLeft = `${cardsLeftNumber} card${addS(cardsLeftNumber)}`;
  return (
    <>
      <div className="heading">
        <TrainingTimer />
        <div className="d-flex flex-column align-items-center progress-info">
          <span className="cards-left-info">
            {cardsLeft} ~ {fancyTime(timeToFinish)}
          </span>
          <ProgressBar className="align-self-center me-2" value={progress} color={COLORS.tertiary} />
        </div>
        <div className="d-flex align-items-center options">
          <FullScreenTrigger />
          <TrainingSettings handlers={handlers} cardId={cardId} />
        </div>
      </div>
    </>
  );
};
