import './training.scss';
import React from 'react';
import { CardDTOs } from '../types';
import { TrainingHeader } from '../training-header';
import { TrainingControls } from '../training-controls';
import { useCards, usePagesPathUpdate } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';
import { CardCarousel } from './card-carousel';

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

  const { cards, currentCardSideS, currentCardIndex, timeToAnswerS, estimateCard, timeToFinish, progress } = useCards(
    trainingDTO._id,
    trainingDTO.cards,
    onLastCard,
  );

  return (
    <div className="d-flex flex-column training">
      <TrainingHeader progress={progress} deckName={trainingDTO.deckName} timeToFinish={timeToFinish} />
      <CardCarousel cards={cards} currentCardSide={currentCardSideS[0]} currentCardIndex={currentCardIndex} />
      <TrainingControls estimate={estimateCard} currentCardSideS={currentCardSideS} timeToAnswerS={timeToAnswerS} />
    </div>
  );
};
