import './training.scss';
import React from 'react';
import { CardDTOs } from '../types';
import { TrainingHeader } from '../training-header';
import { TrainingControls } from '../training-controls';
import { useCards, usePagesPathUpdate } from './hooks';
import { TrainingConceptsInfoP } from '../../../cards/training-cards-info';
import { CardCarousel } from './card-carousel';
import { Fn } from '../../../../utils/types';
import { Box } from '@material-ui/core';

export interface TrainingDTO {
  _id: string;
  deckName: string;
  deckColor: string;
  deckPath: string;
  trainingConceptsInfo: TrainingConceptsInfoP;
  cards: CardDTOs;
}

export interface TrainingsGroupDTO {
  rootDeckName: string;
  trainings: TrainingDTO[];
}

export interface TrainingP {
  dto: TrainingDTO;
  onLastCard: Fn;
}

export const Training = ({ dto, onLastCard }: TrainingP) => {
  const { cards, onDeleteCard, currentCardIndex, estimateCard, timeToFinish, showHiddenFields, areFieldsHidden } =
    useCards(dto._id, dto.cards, onLastCard);

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <TrainingHeader timeToFinish={timeToFinish} currentCardIndex={currentCardIndex} cardsLength={cards.length} />
      <CardCarousel cards={cards} currentCardIndex={currentCardIndex} />
      <TrainingControls
        cardType={cards[currentCardIndex]?.dto.type || 'PASSIVE'}
        estimate={estimateCard}
        showHiddenFields={showHiddenFields}
        areFieldsHidden={areFieldsHidden}
        currentCardIndex={currentCardIndex}
        deleteCard={onDeleteCard}
        cardId={cards[currentCardIndex]?.dto._id || ''}
      />
    </Box>
  );
};

export const TrainingWrapper = (trainingDTO: TrainingDTO) => {
  const onLastCard = usePagesPathUpdate(trainingDTO);
  return <Training dto={trainingDTO} onLastCard={onLastCard} />;
};
