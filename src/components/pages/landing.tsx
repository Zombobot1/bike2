import React, { useRef } from 'react';

import Hero, { HeroBaseP } from '../landing/hero';
import Features, { FeaturesBaseP } from '../landing/features';
import Pricing, { PricingBaseP } from '../landing/pricing';

type LandingP = {
  hero: HeroBaseP;
  features: FeaturesBaseP;
  pricing: PricingBaseP;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scroller = (ways: Map<string, any>) => {
  const scrollFrom = (name: string) => {
    return ways.get(name).current.scrollIntoView();
  };
  return { scrollFrom };
};

const Landing = ({ hero, features, pricing }: LandingP) => {
  const heroRefName = 'hero';
  const featuresRefName = 'features';
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);

  const scr = scroller(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Map<string, any>([
      ['hero', featuresRef],
      ['features', pricingRef],
    ]),
  );
  const { header, paragraph, btnText } = hero;
  const { testimonialsHeader, testimonials, pricingHeader, prices } = pricing;
  return (
    <>
      <Hero header={header} paragraph={paragraph} btnText={btnText} scroller={scr} refName={heroRefName} />
      <Features
        header={features.header}
        features={features.features}
        scroller={scr}
        refName={featuresRefName}
        reff={featuresRef}
      />
      <Pricing
        prices={prices}
        pricingHeader={pricingHeader}
        reff={pricingRef}
        testimonials={testimonials}
        testimonialsHeader={testimonialsHeader}
      />
    </>
  );
};

export { Landing };
export type { LandingP };
