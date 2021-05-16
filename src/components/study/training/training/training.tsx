import './training.scss';
import React, { useState } from 'react';
import { CardDTOs } from '../types';
import { TrainingHeader } from '../training-header';
import { TrainingControls } from '../training-controls';
import { useCards, usePagesPathUpdate } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';
import { CardCarousel } from './card-carousel';
import { usePageVisibility } from '../../../../utils/hooks-utils';
import { ActionOnCardHandlers } from '../training-controls/training-settings';
import { removeElement } from '../../../../utils/utils';
import { deleteCard } from '../../../../api/api';

export interface TrainingDTO {
  _id: string;
  deckName: string;
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  trainingCardsInfo: TrainingCardsInfoP;
  cards: CardDTOs;
}

export const Training = (trainingDTO: TrainingDTO) => {
  const onLastCard = usePagesPathUpdate(trainingDTO);

  const {
    cards,
    setCards,
    currentCardSideS,
    currentCardIndex,
    setCurrentCardIndex,
    timeToAnswerS,
    estimateCard,
    timeToFinish,
    progress,
  } = useCards(trainingDTO._id, trainingDTO.cards, onLastCard);

  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);

  const isPageVisible = usePageVisibility();

  const cardEditingHandlers: ActionOnCardHandlers = {
    onModalShow: pauseTimer,
    onModalClose: resumeTimer,
    onCardDelete: async () => {
      await deleteCard(cards[currentCardIndex]._id);
      setCards((cs) => {
        const result = removeElement(cs, currentCardIndex);
        if (currentCardIndex >= result.length) setCurrentCardIndex((i) => i + 1); // hack to end training
        return result;
      });
    },
  };

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader
        progress={progress}
        deckName={trainingDTO.deckName}
        timeToFinish={timeToFinish}
        handlers={cardEditingHandlers}
        cardId={cards[currentCardIndex]?._id || ''}
      />
      <CardCarousel cards={cards} currentCardIndex={currentCardIndex} currentCardSide={currentCardSideS[0]} />
      <TrainingControls
        estimate={estimateCard}
        currentCardSideS={currentCardSideS}
        timeToAnswerS={timeToAnswerS}
        isTimerRunning={isPageVisible && isTimerRunning}
      />
    </div>
  );
};
