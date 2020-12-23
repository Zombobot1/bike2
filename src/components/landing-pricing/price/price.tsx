import React from 'react';
import './price.scss';

type PriceP = {
  header: string;
  features: string[];
  btnText: string;
};

const Price = ({ header, features, btnText }: PriceP, onClick: () => void) => {
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
      <button className={'btn btn-outline-primary'} onClick={onClick}>
        {btnText}
      </button>
    </div>
  );
};

export default Price;
export type { PriceP };
