import React from 'react';
import '../landing-hero/landing-hero.scss';

import LandingHero, { HeroP } from '../landing-hero';

const App = ({ header, paragraph, btn_text }: HeroP) => (
  <LandingHero header={header} paragraph={paragraph} btn_text={btn_text} />
);

export default App;
