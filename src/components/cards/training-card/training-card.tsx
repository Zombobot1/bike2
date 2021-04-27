import './training-card.scss';
import { SmallDeckCard } from '../types';
import { OverdueType } from '../notification/notification';
import TrainingCardsInfo, { TrainingCardsInfoP } from '../training-cards-info';
import { Overdue } from '../../icons/icons';
import React from 'react';
import { useRouter } from '../../utils/hooks/use-router';
import { STUDY } from '../../pages';
import { TrainingDTO } from '../../study/training/training';

export interface DeckCard extends SmallDeckCard {
  deckPath: string;
}

export interface TrainingCardInfo {
  _id: string;
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
}

const TrainingCard = ({ _id, overdue, deckColor, deckName, deckPath, trainingCardsInfo }: TrainingDTO) => {
  const { history } = useRouter();
  const onClick = () => history.push(`${STUDY}/${_id}`);
  return (
    <div className="training-card" onClick={onClick}>
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <span className="deck-path">{deckPath}</span>
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
    </div>
  );
};

export default TrainingCard;
