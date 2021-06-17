import { Presentation } from './presentation';
import { SwiperSlide } from 'swiper/react';
import { QACard } from '../qa-card';
import React from 'react';
import { CardDTO, CardEstimation } from '../types';

export interface CardData {
  dto: CardDTO;
  showHidden: boolean;
  estimation?: CardEstimation;
}
export type CardDatas = CardData[];

export interface CardCarouselP {
  cards: CardDatas;
  currentCardIndex: number;
}

export const CardCarousel = ({ cards, currentCardIndex }: CardCarouselP) => {
  return (
    <Presentation className="card-carousel" currentSlide={currentCardIndex}>
      {cards.map((c, i) => (
        <SwiperSlide key={c.dto._id}>
          <QACard
            fields={c.dto.fields}
            stageColor={c.dto.stageColor}
            isCurrent={currentCardIndex === i}
            showHidden={c.showHidden}
            estimation={c.estimation}
          />
        </SwiperSlide>
      ))}
    </Presentation>
  );
};
