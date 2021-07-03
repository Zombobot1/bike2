import './training-header.scss';
import { COLORS } from '../../../../theme';
import React from 'react';
import { addS, fancyTime, percentage } from '../../../../utils/formatting';
import { TrainingSettings, TrainingSettingsP } from '../training-controls/training-settings';

export interface ProgressBarP {
  className?: string;
  value: number;
  color: string;
}

export const ProgressBar = ({ className, color, value }: ProgressBarP) => (
  <div className={className + ' progress'}>
    <div className="progress-bar" style={{ width: percentage(value), backgroundColor: color }} />
  </div>
);

export interface TrainingHeaderP extends TrainingSettingsP {
  timeToFinish: number;
  cardsLength: number;
  currentCardIndex: number;
}

const cardsLeftInfo = (cardsLength: number, currentCardIndex: number, timeToFinish: number) => {
  const cardsLeftNumber = cardsLength - currentCardIndex;
  const cardsLeft = `${cardsLeftNumber} card${addS(cardsLeftNumber)}`;
  if (cardsLeftNumber < 100 || timeToFinish < 60 * 60) return `${cardsLeft} ~ ${fancyTime(timeToFinish)}`;
  return `${cardsLeft} ~ ${fancyTime(timeToFinish, true)}`;
};

export const TrainingHeader = ({
  timeToFinish,
  cardsLength,
  currentCardIndex,
  deleteCard,
  cardId,
}: TrainingHeaderP) => {
  const progress = currentCardIndex / cardsLength;

  return (
    <>
      <div className="heading">
        <div className="d-flex align-items-center progress-info">
          <ProgressBar className="align-self-center me-2" value={progress} color={COLORS.tertiary} />
          <span className="cards-left-info me-auto">{cardsLeftInfo(cardsLength, currentCardIndex, timeToFinish)}</span>
          <TrainingSettings deleteCard={deleteCard} cardId={cardId} />
        </div>
      </div>
    </>
  );
};
