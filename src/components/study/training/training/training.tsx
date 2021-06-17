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
import { Fn } from '../../../../utils/types';

export interface TrainingDTO {
  _id: string;
  deckName: string;
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  trainingCardsInfo: TrainingCardsInfoP;
  cards: CardDTOs;
}

export interface TrainingP {
  dto: TrainingDTO;
  onLastCard: Fn;
}

export const Training = ({ dto, onLastCard }: TrainingP) => {
  const {
    cards,
    cardEditingHandlers,
    currentCardIndex,
    timeToAnswerS,
    estimateCard,
    timeToFinish,
    isTimerRunning,
    progress,
    showHiddenFields,
    areFieldsHidden,
  } = useCards(dto._id, dto.cards, onLastCard);

  const isPageVisible = usePageVisibility();

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader
        progress={progress}
        deckName={dto.deckName}
        timeToFinish={timeToFinish}
        handlers={cardEditingHandlers}
        cardId={cards[currentCardIndex]?.dto._id || ''}
      />
      <CardCarousel cards={cards} currentCardIndex={currentCardIndex} />
      <TrainingControls
        cardType={cards[currentCardIndex]?.dto.type || 'PASSIVE'}
        estimate={estimateCard}
        showHiddenFields={showHiddenFields}
        areFieldsHidden={areFieldsHidden}
        timeToAnswerS={timeToAnswerS}
        isTimerRunning={isPageVisible && isTimerRunning}
      />
    </div>
  );
};

export const TrainingWrapper = (trainingDTO: TrainingDTO) => {
  const onLastCard = usePagesPathUpdate(trainingDTO);
  return <Training dto={trainingDTO} onLastCard={onLastCard} />;
};
