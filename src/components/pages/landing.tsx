import React, { useRef } from 'react';

import Hero, { HeroBaseP } from '../landing/hero';
import Features, { FeaturesBaseP } from '../landing/features';
import Pricing, { PricingBaseP } from '../landing/pricing';
import { useInfo } from '../info-provider/info-provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scroller = (ways: Map<string, any>) => {
  const scrollFrom = (name: string) => {
    return ways.get(name).current.scrollIntoView();
  };
  return { scrollFrom };
};

const Landing = () => {
  const info = useInfo();
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
  const { header, paragraph, btnText } = info.hero;
  const { testimonialsHeader, testimonials, pricingHeader, prices } = info.pricing;
  return (
    <>
      <Hero header={header} paragraph={paragraph} btnText={btnText} scroller={scr} refName={heroRefName} />
      <Features
        header={info.features.header}
        features={info.features.features}
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
