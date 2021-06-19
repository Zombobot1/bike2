import React from 'react';
import Price, { PriceP } from '../price';
import './prices.scss';
import ContactUs from '../contact-us';
import { SIGNIN } from '../../pages';
import { BLink } from '../../utils/blink';
import { ModalTrigger } from '../../utils/modal';

export interface PricesP {
  pricingHeader: string;
  prices: PriceP[];
}

const BasicPrice = Price(() => <BLink className="btn btn-outline-primary" text="Register for free" to={SIGNIN} />);

const SpecialPrice = Price(() => <ModalTrigger className="btn btn-primary" modalId="contact" text="Contact us" />);

const Prices = ({ pricingHeader, prices }: PricesP) => {
  const [basicPrice, specialPrice] = prices;
  return (
    <>
      <h2 className={'pricing-subheader'}>{pricingHeader}</h2>
      <div className={'prices'}>
        <BasicPrice {...basicPrice} />
        <SpecialPrice {...specialPrice} />
        <ContactUs />
      </div>
    </>
  );
};

export default Prices;
