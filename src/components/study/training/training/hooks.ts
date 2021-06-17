import { CardDTO, CardDTOs, CardEstimation } from '../types';
import { useEffect, useState } from 'react';
import { deleteCard, estimateAnswer } from '../../../../api/api';
import { useMount } from '../../../../utils/hooks-utils';
import { Fn, NumStateT, StateT } from '../../../../utils/types';
import { useRouter } from '../../../utils/hooks/use-router';
import { STUDY } from '../../../pages';
import { TrainingDTO } from './training';
import { ActionOnCardHandlers } from '../training-controls/training-settings';
import { removeElement } from '../../../../utils/utils';
import { useUserPosition } from '../../../context/user-position-provider';
import { CardData, CardDatas } from './card-carousel';

export const useTrainingProgress = (cards: CardDatas, currentCardIndex: number) => {
  const [timeToFinish, setTimeToFinish] = useState(0);
  const timeLeft = (from: number) => cards.slice(from).reduce((p, e) => p + e.dto.timeToAnswer, 0);
  useEffect(() => setTimeToFinish(timeLeft(currentCardIndex)), [currentCardIndex, cards]);

  const [progress, setProgress] = useState(0);
  useEffect(() => setProgress(currentCardIndex / cards.length), [currentCardIndex, cards]);
  return { timeToFinish, progress };
};

export const useCardActionsHandlers = (cardsS: StateT<CardDatas>, currentCardIndexS: NumStateT) => {
  const [cards, setCards] = cardsS;
  const [currentCardIndex, setCurrentCardIndex] = currentCardIndexS;

  const timeToAnswerS = useState(cards[0]?.dto?.timeToAnswer || 0);
  const [_, setTimeToAnswer] = timeToAnswerS;
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);

  const cardEditingHandlers: ActionOnCardHandlers = {
    onModalShow: pauseTimer,
    onModalClose: resumeTimer,
    onCardDelete: async () => {
      await deleteCard(cards[currentCardIndex].dto._id);
      setCards((cs) => {
        const result = removeElement(cs, currentCardIndex);
        setTimeToAnswer(result[currentCardIndex]?.dto?.timeToAnswer || 0);
        if (currentCardIndex >= result.length) setCurrentCardIndex((i) => i + 1); // hack to end training
        return result;
      });
    },
  };
  return { cardEditingHandlers, isTimerRunning, timeToAnswerS };
};

type CardTransition = 'TRANSIT' | 'NO_TRANSITION';
export type EstimateCard = (v: CardEstimation, ct?: CardTransition) => Fn | undefined;

const cardDTOToCardData = (dto: CardDTO): CardData => ({ dto, showHidden: false });
const cardDTOsToCardDatas = (dtos: CardDTOs) => dtos.map(cardDTOToCardData);

export const useCards = (trainingId: string, initialCards: CardDTOs, onLastCard: Fn) => {
  const [cards, setCards] = useState<CardDatas>(cardDTOsToCardDatas(initialCards));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { cardEditingHandlers, isTimerRunning, timeToAnswerS } = useCardActionsHandlers(
    [cards, setCards],
    [currentCardIndex, setCurrentCardIndex],
  );

  const areFieldsHidden = !(cards[currentCardIndex]?.showHidden ?? false);
  const showHiddenFields = () =>
    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, showHidden: true } : c)));

  const goToNextCard = () => setCurrentCardIndex((i) => i + 1);

  useEffect(() => {
    if (currentCardIndex >= cards.length) return;
    timeToAnswerS[1](cards[currentCardIndex].dto.timeToAnswer);
  }, [currentCardIndex]);

  const { timeToFinish, progress } = useTrainingProgress(cards, currentCardIndex);
  const [isLoading, setIsLoading] = useState(false);

  const estimateCard: EstimateCard = (e: CardEstimation, transition: CardTransition = 'TRANSIT'): Fn | undefined => {
    setIsLoading(true);
    const hasCards = currentCardIndex < cards.length - 1;

    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, estimation: e } : c)));

    estimateAnswer({ deckId: trainingId, cardId: cards[currentCardIndex].dto._id, estimation: e }).then((cards) => {
      setCards((cs) => [...cs, ...cardDTOsToCardDatas(cards)]);
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
    areFieldsHidden,
    showHiddenFields,
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
