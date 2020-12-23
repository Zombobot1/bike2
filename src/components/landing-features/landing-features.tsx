import React from 'react';
import './landing-features.scss';

import ScrollDown from '../shared-icons/scroll-down.svg';
import { Scroller } from '../utils/types';
import Feature, { FeatureP } from './feature';

interface FeaturesBaseP {
  header: string;
  features: FeatureP[];
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
      <div className={'cards'}>{features.map(Feature)}</div>
      <img className={'scroll-down'} src={ScrollDown} alt="sd" onClick={() => scroller.scrollFrom(refName)} />
    </section>
  );
};

export type { FeaturesP, FeaturesBaseP };
export default LandingFeatures;
