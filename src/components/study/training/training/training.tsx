import './training.scss';
import React from 'react';
import { CardDTOs } from '../types';
import { TrainingHeader } from '../training-header';
import { TrainingControls } from '../training-controls';
import { useCards, usePagesPathUpdate } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';
import { CardCarousel } from './card-carousel';
import { usePageVisibility } from '../../../../utils/hooks-utils';

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
    cardEditingHandlers,
    currentCardSideS,
    currentCardIndex,
    timeToAnswerS,
    estimateCard,
    timeToFinish,
    isTimerRunning,
    progress,
  } = useCards(trainingDTO._id, trainingDTO.cards, onLastCard);

  const isPageVisible = usePageVisibility();

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
        cardType={cards[currentCardIndex]?.type || 'PASSIVE'}
        estimate={estimateCard}
        currentCardSideS={currentCardSideS}
        timeToAnswerS={timeToAnswerS}
        isTimerRunning={isPageVisible && isTimerRunning}
      />
    </div>
  );
};
