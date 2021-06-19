import './training.scss';
import React from 'react';
import { CardDTOs } from '../types';
import { TrainingHeader } from '../training-header';
import { TrainingControls } from '../training-controls';
import { useCards, usePagesPathUpdate } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';
import { CardCarousel } from './card-carousel';
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
    onDeleteCard,
    currentCardIndex,
    estimateCard,
    timeToFinish,
    showHiddenFields,
    areFieldsHidden,
  } = useCards(dto._id, dto.cards, onLastCard);

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader
        timeToFinish={timeToFinish}
        deleteCard={onDeleteCard}
        cardId={cards[currentCardIndex]?.dto._id || ''}
        currentCardIndex={currentCardIndex}
        cardsLength={cards.length}
      />
      <CardCarousel cards={cards} currentCardIndex={currentCardIndex} />
      <TrainingControls
        cardType={cards[currentCardIndex]?.dto.type || 'PASSIVE'}
        estimate={estimateCard}
        showHiddenFields={showHiddenFields}
        areFieldsHidden={areFieldsHidden}
        currentCardIndex={currentCardIndex}
      />
    </div>
  );
};

export const TrainingWrapper = (trainingDTO: TrainingDTO) => {
  const onLastCard = usePagesPathUpdate(trainingDTO);
  return <Training dto={trainingDTO} onLastCard={onLastCard} />;
};
