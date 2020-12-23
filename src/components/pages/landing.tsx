import React, { useRef } from 'react';

import LandingHero, { HeroBaseP } from '../landing-hero';
import LandingFeatures, { FeaturesBaseP } from '../landing-features';
import LandingPricing, { PricingBaseP } from '../landing-pricing';

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
  const { header, paragraph, btn_text } = hero;
  const { testimonialsHeader, testimonials, pricingHeader, prices } = pricing;
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
      <LandingPricing
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
