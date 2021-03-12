import './training.scss';
import { useRouter } from '../../../utils/hooks/use-router';
import React, { useEffect, useState } from 'react';
import { usePagesInfoDispatch } from '../../../context/user-position-provider';
import { STUDY } from '../../../pages';
import { AnswerEstimation, CardSide, CardT, TrainingType } from '../types';
import { TrainingHeader } from '../training-header';
import { QACard } from '../qa-card';
import { TrainingControls } from '../training-controls';

export interface TrainingP {
  id: string;
  deckName: string;
  type: TrainingType;
  cards: CardT[];
}

export const Training = ({ id, cards, deckName, type }: TrainingP) => {
  const [currentCardNumber, setCurrentCardNumber] = useState(0);
  const timerSecsLeftS = useState(cards[currentCardNumber].timeout);
  useEffect(() => timerSecsLeftS[1](cards[currentCardNumber].timeout), [currentCardNumber]);

  const dispatch = usePagesInfoDispatch();
  dispatch({ type: 'SET', payload: { path: [{ id, name: deckName }] } });
  const { history } = useRouter();
  const nextCard = () => {
    if (currentCardNumber === cards.length - 1) {
      history.push(STUDY);
      dispatch({ type: 'CLEAR' });
    }
    setCurrentCardNumber((n) => n + 1);
    setCardSide('FRONT');
  };

  const [cardSide, setCardSide] = useState<CardSide>('FRONT');
  const estimate = (e: AnswerEstimation) => console.info('estimation: ' + AnswerEstimation[e]);
  return (
    <div className="d-flex flex-column training">
      <TrainingHeader type={type} deckName={deckName} cards={cards} currentCardNumber={currentCardNumber} />
      <QACard {...cards[currentCardNumber]} side={cardSide} />
      <TrainingControls
        cardSideS={[cardSide, setCardSide]}
        secsLeftS={timerSecsLeftS}
        estimate={estimate}
        nextCard={nextCard}
      />
    </div>
  );
};
