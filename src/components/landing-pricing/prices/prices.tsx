import React, { useState } from 'react';
import Price, { PriceP } from '../price';
import ContactForm from '../contact-form';
import './prices.scss';

interface PricesP {
  pricingHeader: string;
  prices: PriceP[];
}

const Prices = ({ pricingHeader, prices }: PricesP) => {
  const [isContactUsVisible, setIsContactUsVisible] = useState(false);
  const [basicPrice, specialPrice] = prices;
  return (
    <>
      <h2 className={'pricing-subheader'}>{pricingHeader}</h2>
      <div className={'prices'}>
        {Price(basicPrice, () => ({}))}
        {Price(specialPrice, () => setIsContactUsVisible(true))}
        {isContactUsVisible && ContactForm(() => setIsContactUsVisible(false))}
      </div>
    </>
  );
};

export default Prices;
export type { PricesP };
