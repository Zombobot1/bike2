import React from 'react';
import './landing-features.scss';

import ScrollDown from '../shared-icons/scroll-down.svg';
import { Scroller } from '../utils/types';

type Feature = {
  subheader: string;
  description: string;
};

const FeatureC = ({ subheader, description }: Feature, index: number) => {
  const cardName = `cards__feature-${index + 1}`;
  return (
    <div className={cardName} key={index}>
      <h3 className={`${cardName}__h3`}>{subheader}</h3>
      <pre className={`${cardName}__pre`}>{description}</pre>
    </div>
  );
};

interface FeaturesBaseP {
  header: string;
  features: Feature[];
}

interface FeaturesP extends FeaturesBaseP {
  scroller: Scroller;
  refName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reff: any;
}

const LandingFeatures = ({ header, features, scroller, refName, reff }: FeaturesP) => {
  return (
    <section className={'landing-features-screen'} ref={reff}>
      <h2 className={'landing-features-screen__h2'}>{header}</h2>
      <div className={'cards'}>{features.map(FeatureC)}</div>
      <img className={'scroll-down'} src={ScrollDown} alt="sd" onClick={() => scroller.scrollFrom(refName)} />
    </section>
  );
};

export type { FeaturesP, FeaturesBaseP };
export default LandingFeatures;
