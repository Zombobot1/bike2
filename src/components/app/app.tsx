import React, { useRef } from 'react';
import '../landing-hero/landing-hero.scss';

import LandingHero, { HeroBaseP } from '../landing-hero';
import LandingFeatures, { FeaturesBaseP } from '../landing-features';

type AppP = {
  hero: HeroBaseP;
  features: FeaturesBaseP;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scroller = (ways: Map<string, any>) => {
  const scrollFrom = (name: string) => {
    debugger; // eslint-disable-line no-debugger
    return ways.get(name).current.scrollIntoView();
  };
  return { scrollFrom };
};

const App = ({ hero, features }: AppP) => {
  const heroRefName = 'hero';
  const featuresRefName = 'features';
  const featuresRef = useRef(null);

  const scr = scroller(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Map<string, any>([
      ['hero', featuresRef],
      ['features', ''],
    ]),
  );
  const { header, paragraph, btn_text } = hero;

  return (
    <>
      <LandingHero header={header} paragraph={paragraph} btn_text={btn_text} scroller={scr} refName={heroRefName} />
      <LandingFeatures
        header={features.header}
        features={features.features}
        scroller={scr}
        refName={featuresRefName}
        reff={featuresRef}
      />
    </>
  );
};

export default App;
