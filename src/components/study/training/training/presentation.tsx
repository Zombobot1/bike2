import { ReactNodeArray, useEffect, useState } from 'react';
import SwiperClass from 'swiper/types/swiper-class';
import { safe } from '../../../../utils/utils';
import { Swiper } from 'swiper/react';
import 'swiper/swiper.scss';
import { atom, useAtom } from 'jotai';

export interface PresentationP {
  currentSlide: number;
  children: ReactNodeArray;
}

const isInTransitionAtom = atom(false);

const usePresentationTransition_ = () => {
  const [isInTransition, setIsInTransition] = useAtom(isInTransitionAtom);
  return { isInTransition, setIsInTransition };
};

export const usePresentationTransition = () => {
  const { isInTransition } = usePresentationTransition_();
  return { isInTransition };
};

export const Presentation = ({ children, currentSlide }: PresentationP) => {
  const { setIsInTransition } = usePresentationTransition_();
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(Boolean(swiper)), [swiper]);

  useEffect(() => {
    if (isReady && currentSlide < children.length) safe(swiper).slideTo(currentSlide);
  }, [currentSlide]);

  return (
    <Swiper
      slidesPerView="auto"
      style={{ height: '100%', width: '100%' }}
      spaceBetween={15}
      onSwiper={(s: SwiperClass) => {
        s.allowTouchMove = false;
        s.on('slideChangeTransitionStart', () => setIsInTransition(true));
        s.on('slideChangeTransitionEnd', () => setIsInTransition(false));
        setSwiper(s);
      }}
    >
      {children}
    </Swiper>
  );
};
