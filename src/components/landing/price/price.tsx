import React, { FC } from 'react';
import './price.scss';

type PriceP = {
  header: string;
  features: string[];
};

const Price = (Button: FC) => ({ header, features }: PriceP) => {
  return (
    <div className={'price'}>
      <h3>{header}</h3>
      <div className={'list-container'}>
        <ul>
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
      <Button />
    </div>
  );
};

export default Price;
export type { PriceP };
