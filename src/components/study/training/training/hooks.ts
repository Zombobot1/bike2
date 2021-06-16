import { CardDTO, CardDTOs, CardEstimation, CardSide } from '../types';
import { useEffect, useState } from 'react';
import { deleteCard, estimateAnswer } from '../../../../api/api';
import { useEffectedState, useMount } from '../../../../utils/hooks-utils';
import { Fn, NumStateT, StateT } from '../../../../utils/types';
import { useRouter } from '../../../utils/hooks/use-router';
import { STUDY } from '../../../pages';
import { TrainingDTO } from './training';
import { ActionOnCardHandlers } from '../training-controls/training-settings';
import { removeElement } from '../../../../utils/utils';
import { useUserPosition } from '../../../context/user-position-provider';

export const useTrainingProgress = (cards: CardDTOs, currentCardIndex: number) => {
  const [timeToFinish, setTimeToFinish] = useState(0);
  const timeLeft = (from: number) => cards.slice(from).reduce((p, e) => p + e.timeToAnswer, 0);
  useEffect(() => setTimeToFinish(timeLeft(currentCardIndex)), [currentCardIndex, cards]);

  const [progress, setProgress] = useState(0);
  useEffect(() => setProgress(currentCardIndex / cards.length), [currentCardIndex, cards]);
  return { timeToFinish, progress };
};

export const useCardActionsHandlers = (cardsS: StateT<CardDTOs>, currentCardIndexS: NumStateT) => {
  const [cards, setCards] = cardsS;
  const [currentCardIndex, setCurrentCardIndex] = currentCardIndexS;

  const timeToAnswerS = useState(cards[0]?.timeToAnswer || 0);
  const [_, setTimeToAnswer] = timeToAnswerS;
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);

  const cardEditingHandlers: ActionOnCardHandlers = {
    onModalShow: pauseTimer,
    onModalClose: resumeTimer,
    onCardDelete: async () => {
      await deleteCard(cards[currentCardIndex]._id);
      setCards((cs) => {
        const result = removeElement(cs, currentCardIndex);
        setTimeToAnswer(result[currentCardIndex]?.timeToAnswer || 0);
        if (currentCardIndex >= result.length) setCurrentCardIndex((i) => i + 1); // hack to end training
        return result;
      });
    },
  };
  return { cardEditingHandlers, isTimerRunning, timeToAnswerS };
};

type CardTransition = 'TRANSIT' | 'NO_TRANSITION';
export type EstimateCard = (v: CardEstimation, ct?: CardTransition) => Fn | undefined;

export const useCards = (trainingId: string, initialCards: CardDTO[], onLastCard: Fn) => {
  const [cards, setCards] = useEffectedState<CardDTOs>(initialCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { cardEditingHandlers, isTimerRunning, timeToAnswerS } = useCardActionsHandlers(
    [cards, setCards],
    [currentCardIndex, setCurrentCardIndex],
  );

  const currentCardSideS = useState<CardSide>('FRONT');
  const goToNextCard = () => setCurrentCardIndex((i) => i + 1);

  useEffect(() => {
    if (currentCardIndex >= cards.length) return;
    currentCardSideS[1]('FRONT');
    timeToAnswerS[1](cards[currentCardIndex].timeToAnswer);
  }, [currentCardIndex]);

  const { timeToFinish, progress } = useTrainingProgress(cards, currentCardIndex);
  const [isLoading, setIsLoading] = useState(false);

  const estimateCard: EstimateCard = (e: CardEstimation, transition: CardTransition = 'TRANSIT'): Fn | undefined => {
    setIsLoading(true);
    const hasCards = currentCardIndex < cards.length - 1;

    estimateAnswer({ deckId: trainingId, cardId: cards[currentCardIndex]._id, estimation: e }).then((cards) => {
      setCards((cs) => [...cs, ...cards]);
      setIsLoading(false);
      if (transition === 'TRANSIT' && !hasCards) goToNextCard();
    });

    if (transition === 'TRANSIT' && hasCards) goToNextCard();
    else if (transition === 'NO_TRANSITION') return goToNextCard;
  };

  useEffect(() => {
    if (!isLoading && currentCardIndex >= cards.length) onLastCard();
  }, [cards, isLoading, currentCardIndex]);

  return {
    cards,
    cardEditingHandlers,
    currentCardSideS,
    currentCardIndex,
    timeToAnswerS,
    estimateCard,
    timeToFinish,
    isTimerRunning,
    progress,
  };
};

type OnLastCard = Fn;
export const usePagesPathUpdate = ({ _id, deckName }: TrainingDTO): OnLastCard => {
  const { history } = useRouter();
  const { setPath, clearPath } = useUserPosition();

  useMount(() => {
    setPath([{ id: _id, name: deckName }]);
  });

  return () => {
    history.push(STUDY);
    clearPath();
  };
};
