import React, { Ref } from 'react';
import './pricing.scss';

import Testimonials, { TestimonialsP } from '../../landing/testimonials';
import Prices, { PricesP } from '../../landing/prices';
import Footer from '../../landing/footer';

interface PricingBaseP extends TestimonialsP, PricesP {}

interface PricingP extends PricingBaseP {
  reff: Ref<HTMLElement>;
}

const Pricing = ({ testimonialsHeader, testimonials, pricingHeader, prices, reff }: PricingP) => (
  <section className={'pricing-screen'} ref={reff}>
    <Testimonials testimonialsHeader={testimonialsHeader} testimonials={testimonials} />
    <Prices pricingHeader={pricingHeader} prices={prices} />
    <Footer />
  </section>
);

export type { PricingBaseP, PricingP };
export default Pricing;
