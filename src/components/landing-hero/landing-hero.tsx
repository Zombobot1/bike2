import React from 'react';
import './landing-hero.scss';

import CardsImg from './cards-background-img.svg';
import ScrollDown from './scroll-down.svg';

type HeroP = {
  header: string;
  paragraph: string;
  btn_text: string;
};

const all_but_last_word = (text: string): string => {
  return text.split(' ').slice(0, -1).join(' ');
};

const last_word = (text: string): string => {
  return text.split(' ').slice(-1)[0];
};

const LandingHero = ({ header, paragraph, btn_text }: HeroP) => (
  <div className={'landing-hero-screen'}>
    <div className={'hero'}>
      <h1 className={'hero__h-top'}>{all_but_last_word(header)}</h1>
      <h1 className={'hero__h-bottom'}>{last_word(header)}</h1>
      <p className={'hero__p'}>{paragraph}</p>
      <button className={'hero__btn-cta'}>{btn_text}</button>
    </div>
    <img className={'girl-img'} src={CardsImg} alt="Girl and cards" />
    <img className={'scroll-down'} src={ScrollDown} alt="sd" />
  </div>
);

export type { HeroP };
export default LandingHero;
