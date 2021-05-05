import React, { ReactNodeArray, useEffect, useState } from 'react';
import SwiperClass from 'swiper/types/swiper-class';
import { s } from '../../../../utils/utils';
import { Swiper } from 'swiper/react';
import 'swiper/swiper.scss';

export interface PresentationP {
  className: string;
  currentSlide: number;
  children: ReactNodeArray;
}

export const Presentation = ({ children, currentSlide, className }: PresentationP) => {
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
