import { StateT } from '../../../forms/hoc/with-validation';
import { priorityQueue, PriorityQueue } from '../../../../utils/priority-queue';
import { AnswerEstimation, CardT } from '../types';
import { useEffect, useState } from 'react';
import { estimateAnswer } from '../../../../api/api';

type trainingCardsS = StateT<PriorityQueue<CardT>>;

export const useCardsUpdate = (cardsS: trainingCardsS) => {
  const [cards, setCards] = cardsS;
  const [newCards, setNewCards] = useState<CardT[]>([]);
  useEffect(() => {
    if (!newCards.length) return;
    setCards(cards.insert(newCards));
    setNewCards([]);
  }, [newCards]);
  return setNewCards;
};

export const useTrainingProgress = (cardsS: trainingCardsS) => {
  const [cards] = cardsS;
  const [passedCards, setPassedCards] = useState(0);
  const [totalCards, setTotalCards] = useState(cards.size());

  const [timeToFinish, setTimeToFinish] = useState(0);
  useEffect(() => setTimeToFinish(cards.toArray().reduce((p, e) => p + e.timeout, 0)), [cards]);
  const [progress, setProgress] = useState(0);
  useEffect(() => setProgress(passedCards / totalCards), [passedCards, totalCards]);

  return { timeToFinish, progress, setPassedCards, setTotalCards };
};

export const useCards = (trainingId: string, initialCards: CardT[], onLastCard: () => void, onNextCard: () => void) => {
  const [cards, setCards] = useState(priorityQueue((e: CardT) => e.priority, initialCards));
  const setNewCards = useCardsUpdate([cards, setCards]);
  const { timeToFinish, progress, setPassedCards, setTotalCards } = useTrainingProgress([cards, setCards]);

  const [currentCard, setCurrentCard] = useState(initialCards[0]);
  useEffect(() => {
    if (cards.size()) setCurrentCard(cards.top());
  }, [cards]);
  const [isLoading, setIsLoading] = useState(false);

  const moveToNextCard = () => {
    if (cards.size() === 0) return;
    const newCards = cards.pop();
    setCards(newCards);
    setPassedCards((v) => v + 1);
    onNextCard();
  };

  const estimateCard = (e: AnswerEstimation) => {
    setIsLoading(true);
    estimateAnswer(trainingId, currentCard.id, e).then((res) => {
      setTotalCards((v) => v + res.length);
      setNewCards(res);
      setIsLoading(false);
    });
    moveToNextCard();
  };

  useEffect(() => {
    if (!isLoading && !cards.size()) onLastCard();
  }, [cards, isLoading]);

  return { currentCard, estimateCard, timeToFinish, progress };
};
