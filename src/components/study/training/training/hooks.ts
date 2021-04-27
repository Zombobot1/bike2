import { StateT } from '../../../forms/hoc/with-validation';
import { priorityQueue, PriorityQueue } from '../../../../utils/priority-queue';
import { CardEstimation, CardDTO } from '../types';
import { useEffect, useState } from 'react';
import { estimateAnswer } from '../../../../api/api';
import { useEffectedState } from '../../training-deck/training-deck';

type TrainingCardsQueueS = StateT<PriorityQueue<CardDTO>>;

export const useCardsUpdate = (cardsS: TrainingCardsQueueS) => {
  const [cards, setCards] = cardsS;
  const [newCards, setNewCards] = useState<CardDTO[]>([]);
  useEffect(() => {
    if (!newCards.length) return;
    setCards(cards.insert(newCards));
    setNewCards([]);
  }, [newCards]);
  return setNewCards;
};

export const useTrainingProgress = (cardsS: TrainingCardsQueueS) => {
  const [cards] = cardsS;
  const [passedCards, setPassedCards] = useState(0);
  const [totalCards, setTotalCards] = useState(cards.size());

  const [timeToFinish, setTimeToFinish] = useState(0);
  useEffect(() => setTimeToFinish(cards.toArray().reduce((p, e) => p + e.timeToAnswer, 0)), [cards]);
  const [progress, setProgress] = useState(0);
  useEffect(() => setProgress(passedCards / totalCards), [passedCards, totalCards]);

  return { timeToFinish, progress, setPassedCards, setTotalCards };
};

const cardsQueue = (initialCards: CardDTO[]) => priorityQueue((e: CardDTO) => e.priority, initialCards);

export const useCards = (
  trainingId: string,
  initialCards: CardDTO[],
  onLastCard: () => void,
  onNextCard: () => void,
  updatedAt: string,
  highestPriority: string,
) => {
  const [rawCards] = useEffectedState(initialCards);
  const [cards, setCards] = useState(cardsQueue(initialCards));
  useEffect(() => setCards(cardsQueue(rawCards)), [rawCards]);

  const setNewCards = useCardsUpdate([cards, setCards]);
  const [trainingMetaInfo, setTrainingMetaInfo] = useState({ updatedAt, highestPriority });
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

  const estimateCard = (e: CardEstimation) => {
    setIsLoading(true);
    estimateAnswer({ ...trainingMetaInfo, deckId: trainingId, cardId: currentCard._id, estimation: e }).then((res) => {
      setTotalCards((v) => v + res.cards.length);
      setNewCards(res.cards);
      setTrainingMetaInfo({ updatedAt: res.updatedAt, highestPriority: res.highestPriority });
      setIsLoading(false);
    });
    moveToNextCard();
  };

  useEffect(() => {
    if (!isLoading && !cards.size()) onLastCard();
  }, [cards, isLoading]);

  return { currentCard, estimateCard, timeToFinish, progress };
};
