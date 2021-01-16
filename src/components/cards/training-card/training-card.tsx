import './training-card.scss';
import { SmallDeckCard } from '../types';
import { OverdueType } from '../notification/notification';
import TrainingCardsInfo, { TrainingCardsInfoP } from '../training-cards-info';
import { Overdue } from '../../icons/icons';
import React from 'react';

export interface DeckCard extends SmallDeckCard {
  deckPath: string;
}

export interface TrainingCardInfo {
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
}

export interface TrainingCardP extends DeckCard, TrainingCardInfo {}

const TrainingCard = ({ overdue, deckColor, deckName, deckPath, trainingCardsInfo }: TrainingCardP) => {
  return (
    <div className="training-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <span className="deck-path">{deckPath}</span>
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
    </div>
  );
};

export default TrainingCard;
