import React from 'react';
import './hero.scss';

import { ReactComponent as CardsImg } from './cards-background-img.svg';
import { ReactComponent as ScrollDown } from '../../icons/scroll-down.svg';
import { Scroller } from '../../../utils/types';
import { Link } from 'react-router-dom';
import { PAGES } from '../../pages';

interface HeroBaseP {
  header: string;
  paragraph: string;
  btnText: string;
}

interface HeroP extends HeroBaseP {
  scroller: Scroller;
  refName: string;
}

const all_but_last_word = (text: string): string => {
  return text.split(' ').slice(0, -1).join(' ');
};

const last_word = (text: string): string => {
  return text.split(' ').slice(-1)[0];
};

const Hero = ({ header, paragraph, btnText, scroller, refName }: HeroP) => {
  return (
    <section className={'hero-screen'}>
      <div className={'hero'}>
        <h1 className={'hero__h-top'}>{all_but_last_word(header)}</h1>
        <h1 className={'hero__h-bottom'}>{last_word(header)}</h1>
        <p className={'hero__p'}>{paragraph}</p>
        <Link className={'hero__btn-cta'} to={PAGES.signIn}>
          {btnText}
        </Link>
      </div>
      <CardsImg className={'girl-img'} />
      <ScrollDown className={'scroll-down'} onClick={() => scroller.scrollFrom(refName)} />
    </section>
  );
};

export type { HeroP, HeroBaseP };
export default Hero;
