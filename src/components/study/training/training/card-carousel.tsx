import { Presentation } from './presentation';
import { SwiperSlide } from 'swiper/react';
import { QACard } from '../qa-card';
import React from 'react';
import { CardDTOs, CardSide } from '../types';

export interface CardCarouselP {
  cards: CardDTOs;
  currentCardIndex: number;
  currentCardSide: CardSide;
}

export const CardCarousel = ({ cards, currentCardIndex, currentCardSide }: CardCarouselP) => {
  return (
    <Presentation className="card-carousel" currentSlide={currentCardIndex}>
      {cards.map((c, i) => (
        <SwiperSlide key={c._id}>
          <QACard
            fields={c.fields}
            stageColor={c.stageColor}
            side={currentCardIndex === i ? currentCardSide : 'FRONT'}
          />
        </SwiperSlide>
      ))}
    </Presentation>
  );
};
