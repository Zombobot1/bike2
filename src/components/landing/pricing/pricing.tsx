import React, { Ref } from 'react';
import './pricing.scss';

import Testimonials, { TestimonialsP } from '../../landing/testimonials';
import Prices, { PricesP } from '../../landing/prices';
import Footer from '../../footer';

export interface PricingBaseP extends TestimonialsP, PricesP {}

export interface PricingP extends PricingBaseP {
  reff: Ref<HTMLElement>;
}

const Pricing = ({ testimonialsHeader, testimonials, pricingHeader, prices, reff }: PricingP) => (
  <section className={'pricing-screen'} ref={reff}>
    <Testimonials testimonialsHeader={testimonialsHeader} testimonials={testimonials} />
    <Prices pricingHeader={pricingHeader} prices={prices} />
    <Footer className="landing__footer" />
  </section>
);

export default Pricing;
