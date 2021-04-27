import './training.scss';
import { useRouter } from '../../../utils/hooks/use-router';
import React, { useEffect, useState } from 'react';
import { usePagesInfoDispatch } from '../../../context/user-position-provider';
import { STUDY } from '../../../pages';
import { CardSide, TrainingUpdateDTO } from '../types';
import { TrainingHeader } from '../training-header';
import { QACard } from '../qa-card';
import { TrainingControls } from '../training-controls';
import { useCards } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';

export interface TrainingDTO extends TrainingUpdateDTO {
  _id: string;
  deckName: string;
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  trainingCardsInfo: TrainingCardsInfoP;
}

export const Training = ({ _id, cards, deckName, highestPriority, updatedAt }: TrainingDTO) => {
  const { history } = useRouter();
  const onLastCard = () => {
    history.push(STUDY);
    dispatch({ type: 'CLEAR' });
  };
  const onNextCard = () => setCardSide('FRONT');
  const { currentCard, estimateCard, timeToFinish, progress } = useCards(
    _id,
    cards,
    onLastCard,
    onNextCard,
    updatedAt,
    highestPriority,
  );

  const timerSecsLeftS = useState(currentCard.timeToAnswer);
  useEffect(() => timerSecsLeftS[1](currentCard.timeToAnswer), [currentCard]);

  const dispatch = usePagesInfoDispatch();
  useEffect(() => dispatch({ type: 'SET', payload: { path: [{ id: _id, name: deckName }] } }), []);

  const [cardSide, setCardSide] = useState<CardSide>('FRONT');

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader progress={progress} deckName={deckName} timeToFinish={timeToFinish} />
      <QACard {...currentCard} side={cardSide} />
      <TrainingControls cardSideS={[cardSide, setCardSide]} secsLeftS={timerSecsLeftS} estimate={estimateCard} />
    </div>
  );
};
