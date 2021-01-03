import './last-training-card.scss';
import { OverdueType } from '../notification/notification';
import { Overdue } from '../../icons/icons';
import React from 'react';
import { DeckCard } from '../types';
import TrainingCardsInfo from '../training-cards-info';
import { TrainingCardsInfoP } from '../training-cards-info/training-cards-info';
import { fancyDate } from '../../../utils/formatting';

export interface LastTrainingCardP extends DeckCard {
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
  editingDate: string;
}

const LastTrainingCard = ({ overdue, deckColor, deckName, editingDate, trainingCardsInfo }: LastTrainingCardP) => {
  return (
    <div className="last-training-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
      <span className="time">Trained: {fancyDate(editingDate)}</span>
    </div>
  );
};

export default LastTrainingCard;
