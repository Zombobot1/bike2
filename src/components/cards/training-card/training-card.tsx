import './training-card.scss';
import { SmallDeckCard } from '../types';
import { OverdueType } from '../notification/notification';
import TrainingCardsInfo, { TrainingCardsInfoP } from '../training-cards-info';
import { Overdue } from '../../icons/icons';
import React from 'react';
import { useRouter } from '../../utils/hooks/use-router';
import { usePagesInfoDispatch } from '../../context/user-position-provider';
import { STUDY } from '../../pages';

export interface DeckCard extends SmallDeckCard {
  deckPath: string;
}

export interface TrainingCardInfo {
  id: string;
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
}

export interface TrainingCardP extends DeckCard, TrainingCardInfo {}

const TrainingCard = ({ id, overdue, deckColor, deckName, deckPath, trainingCardsInfo }: TrainingCardP) => {
  const { history } = useRouter();
  const dispatch = usePagesInfoDispatch();
  const onClick = () => {
    dispatch({ type: 'ADD', payload: [id, deckName] });
    history.push(`${STUDY}/${id}`);
  };
  // eslint-disable-next-line no-debugger
  debugger;
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
