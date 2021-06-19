import './training-header.scss';
import { COLORS } from '../../../../config';
import React from 'react';
import { ProgressBar } from '../../../controls/progress-bar';
import { FullScreenTrigger } from '../../../utils/full-screen-trigger';
import { addS, fancyTime } from '../../../../utils/formatting';
import { TrainingSettings, TrainingSettingsP } from '../training-controls/training-settings';

export interface TrainingHeaderP extends TrainingSettingsP {
  timeToFinish: number;
  cardsLength: number;
  currentCardIndex: number;
}

export const TrainingHeader = ({
  timeToFinish,
  cardsLength,
  currentCardIndex,
  deleteCard,
  cardId,
}: TrainingHeaderP) => {
  const progress = currentCardIndex / cardsLength;
  const cardsLeftNumber = cardsLength - currentCardIndex;
  const cardsLeft = `${cardsLeftNumber} card${addS(cardsLeftNumber)}`;
  return (
    <>
      <div className="heading">
        <div className="d-flex align-items-center progress-info">
          <ProgressBar className="align-self-center me-2" value={progress} color={COLORS.tertiary} />
          <span className="cards-left-info me-auto">
            {cardsLeft} ~ {fancyTime(timeToFinish)}
          </span>
          <FullScreenTrigger />
          <TrainingSettings deleteCard={deleteCard} cardId={cardId} />
        </div>
      </div>
    </>
  );
};
