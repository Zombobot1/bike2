import { StateT } from '../../../forms/hoc/with-validation';
import { CardEstimation, CardDTO, CardDTOs, CardSide } from '../types';
import { useEffect, useState } from 'react';
import { estimateAnswer } from '../../../../api/api';
import { useEffectedState } from '../../training-deck/training-deck';
import { useMount } from '../../../../utils/hooks-utils';
import { Fn } from '../../../../utils/types';

type TrainingCardsS = StateT<CardDTOs>;

export const useCardsUpdate = (cardsS: TrainingCardsS) => {
  const [cards, setCards] = cardsS;
  const [newCards, setNewCards] = useState<CardDTOs>([]);
  useEffect(() => {
    if (!newCards.length) return;
    setCards([...cards, ...newCards]);
    setNewCards([]);
  }, [newCards]);
  return setNewCards;
};

export const useTrainingProgress = (cards: CardDTOs, currentCardIndex: number) => {
  const [timeToFinish, setTimeToFinish] = useState(0);
  const timeLeft = (from: number) => cards.slice(from).reduce((p, e) => p + e.timeToAnswer, 0);
  useEffect(() => setTimeToFinish(timeLeft(currentCardIndex)), [currentCardIndex, cards]);

  const [progress, setProgress] = useState(0);
  useEffect(() => setProgress(currentCardIndex / cards.length), [currentCardIndex, cards]);
  return { timeToFinish, progress };
};

export const useCards = (trainingId: string, initialCards: CardDTO[], onLastCard: Fn) => {
  const [cards, setCards] = useEffectedState<CardDTOs>(initialCards);

  useMount(() => {
    console.log('mounted');
    return () => console.log('unmounted');
  });

  cards.forEach((c) => console.log('cards', c.stageColor));
  initialCards.forEach((c) => console.log('initialCards', c.stageColor));

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const currentCardSideS = useState<CardSide>('FRONT');
  const goToNextCard = () => setCurrentCardIndex((i) => (i + 1) % (cards.length + 1));
  const timeToAnswerS = useState(0);

  useEffect(() => {
    if (currentCardIndex >= cards.length) return;
    currentCardSideS[1]('FRONT');
    timeToAnswerS[1](cards[currentCardIndex].timeToAnswer);
  }, [currentCardIndex]);

  const { timeToFinish, progress } = useTrainingProgress(cards, currentCardIndex);
  const [isLoading, setIsLoading] = useState(false);

  const estimateCard = (e: CardEstimation) => {
    setIsLoading(true);
    estimateAnswer({ deckId: trainingId, cardId: cards[currentCardIndex]._id, estimation: e }).then((cards) => {
      setCards((cs) => [...cs, ...cards]);
      setIsLoading(false);
    });
    goToNextCard();
  };

  useEffect(() => {
    if (!isLoading && currentCardIndex === cards.length) onLastCard();
  }, [cards, isLoading, currentCardIndex]);

  return { cards, currentCardSideS, currentCardIndex, timeToAnswerS, estimateCard, timeToFinish, progress };
};
