import React from 'react';
import './features.scss';

import { ReactComponent as ScrollDown } from '../../icons/scroll-down.svg';
import { Scroller } from '../../../utils/types';
import Feature, { FeatureP } from '../../landing/feature';

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

const Features = ({ header, features, scroller, refName, reff }: FeaturesP) => {
  return (
    <section className={'features-screen'} ref={reff}>
      <h2 className={'features-screen__h2'}>{header}</h2>
      <div className={'cards'}>{features.map(Feature)}</div>
      <ScrollDown className={'scroll-down'} onClick={() => scroller.scrollFrom(refName)} />
    </section>
  );
};

export type { FeaturesP, FeaturesBaseP };
export default Features;
