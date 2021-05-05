import './training.scss';
import { useRouter } from '../../../utils/hooks/use-router';
import React, { ReactNodeArray, useEffect, useState } from 'react';
import { usePagesInfoDispatch } from '../../../context/user-position-provider';
import { STUDY } from '../../../pages';
import { CardDTOs, CardSide } from '../types';
import { TrainingHeader } from '../training-header';
import { QACard } from '../qa-card';
import { TrainingControls } from '../training-controls';
import { useCards } from './hooks';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardsInfoP } from '../../../cards/training-cards-info';
import { useMount } from '../../../../utils/hooks-utils';
import SwiperClass from 'swiper/types/swiper-class';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import { Fn } from '../../../../utils/types';
import { s } from '../../../../utils/utils';

export interface TrainingDTO {
  _id: string;
  deckName: string;
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  trainingCardsInfo: TrainingCardsInfoP;
  cards: CardDTOs;
}

type OnLastCard = Fn;
const usePagesPathUpdate = ({ _id, deckName }: TrainingDTO): OnLastCard => {
  const { history } = useRouter();
  const pagesInfoDispatch = usePagesInfoDispatch();

  useMount(() => {
    pagesInfoDispatch({ type: 'SET', payload: { path: [{ id: _id, name: deckName }] } });
  });

  return () => {
    history.push(STUDY);
    pagesInfoDispatch({ type: 'CLEAR' });
  };
};

export interface PresentationP {
  className: string;
  currentSlide: number;
  children: ReactNodeArray;
}

const Presentation = ({ children, currentSlide, className }: PresentationP) => {
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(Boolean(swiper)), [swiper]);

  useEffect(() => {
    if (isReady && currentSlide < children.length) s(swiper).slideTo(currentSlide);
  }, [currentSlide]);

  return (
    <Swiper
      spaceBetween={15}
      className={className}
      onSwiper={(s: SwiperClass) => {
        s.allowTouchMove = false;
        setSwiper(s);
      }}
    >
      {children}
    </Swiper>
  );
};

export interface CardCarouselP {
  cards: CardDTOs;
  currentCardIndex: number;
  currentCardSide: CardSide;
}

const CardCarousel = ({ cards, currentCardIndex, currentCardSide }: CardCarouselP) => {
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
