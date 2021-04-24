import './training.scss';
import { useRouter } from '../../../utils/hooks/use-router';
import React, { useEffect, useState } from 'react';
import { usePagesInfoDispatch } from '../../../context/user-position-provider';
import { STUDY } from '../../../pages';
import { CardSide, CardDTO } from '../types';
import { TrainingHeader } from '../training-header';
import { QACard } from '../qa-card';
import { TrainingControls } from '../training-controls';
import { useCards } from './hooks';

export interface TrainingP {
  id: string;
  deckName: string;
  initialCards: CardDTO[];
}

export const Training = ({ id, initialCards, deckName }: TrainingP) => {
  const { history } = useRouter();
  const onLastCard = () => {
    history.push(STUDY);
    dispatch({ type: 'CLEAR' });
  };
  const onNextCard = () => setCardSide('FRONT');
  const { currentCard, estimateCard, timeToFinish, progress } = useCards(id, initialCards, onLastCard, onNextCard);

  const timerSecsLeftS = useState(currentCard.timeToLearn);
  useEffect(() => timerSecsLeftS[1](currentCard.timeToLearn), [currentCard]);

  const dispatch = usePagesInfoDispatch();
  useEffect(() => dispatch({ type: 'SET', payload: { path: [{ id, name: deckName }] } }), []);

  const [cardSide, setCardSide] = useState<CardSide>('FRONT');

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader progress={progress} deckName={deckName} timeToFinish={timeToFinish} />
      <QACard {...currentCard} side={cardSide} />
      <TrainingControls cardSideS={[cardSide, setCardSide]} secsLeftS={timerSecsLeftS} estimate={estimateCard} />
    </div>
  );
};
