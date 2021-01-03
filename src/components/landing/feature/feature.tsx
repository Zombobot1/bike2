import './feature.scss';
import React from 'react';

export interface FeatureP {
  subheader: string;
  description: string;
}

const Feature = ({ subheader, description }: FeatureP, index: number) => {
  const cardName = `feature-${index + 1}`;
  return (
    <div className={cardName} key={index}>
      <h3 className={`${cardName}__h3`}>{subheader}</h3>
      <pre className={`${cardName}__pre`}>{description}</pre>
    </div>
  );
};

export default Feature;
