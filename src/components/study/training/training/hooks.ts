import { CardDTO, CardDTOs, CardEstimation, CardSide } from '../types';
import { useEffect, useState } from 'react';
import { estimateAnswer } from '../../../../api/api';
import { useEffectedState, useMount } from '../../../../utils/hooks-utils';
import { Fn } from '../../../../utils/types';
import { useRouter } from '../../../utils/hooks/use-router';
import { usePagesInfoDispatch } from '../../../context/user-position-provider';
import { STUDY } from '../../../pages';
import { TrainingDTO } from './training';

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

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const currentCardSideS = useState<CardSide>('FRONT');
  const goToNextCard = () => setCurrentCardIndex((i) => i + 1);
  const timeToAnswerS = useState(cards[0].timeToAnswer);

  useEffect(() => {
    if (currentCardIndex >= cards.length) return;
    currentCardSideS[1]('FRONT');
    timeToAnswerS[1](cards[currentCardIndex].timeToAnswer);
  }, [currentCardIndex]);

  const { timeToFinish, progress } = useTrainingProgress(cards, currentCardIndex);
  const [isLoading, setIsLoading] = useState(false);

  const estimateCard = (e: CardEstimation) => {
    setIsLoading(true);
    const hasCards = currentCardIndex < cards.length - 1; // premature optimization for slow 3g?
    estimateAnswer({ deckId: trainingId, cardId: cards[currentCardIndex]._id, estimation: e }).then((cards) => {
      setCards((cs) => [...cs, ...cards]);
      setIsLoading(false);
      if (!hasCards) goToNextCard();
    });
    if (hasCards) goToNextCard();
  };

  useEffect(() => {
    if (!isLoading && currentCardIndex === cards.length) onLastCard();
  }, [cards, isLoading, currentCardIndex]);

  return { cards, currentCardSideS, currentCardIndex, timeToAnswerS, estimateCard, timeToFinish, progress };
};

type OnLastCard = Fn;
export const usePagesPathUpdate = ({ _id, deckName }: TrainingDTO): OnLastCard => {
  const { history } = useRouter();
  const pagesInfoDispatch = usePagesInfoDispatch();

  useMount(() => {
    pagesInfoDispatch({ type: 'SET', payload: { path: [{ id: _id, name: deckName }] } });
  });

  return () => {
    history.push(STUDY);
    pagesInfoDispatch({ type: 'CLEAR' });
  };
};
