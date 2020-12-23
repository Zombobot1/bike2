import React, { Ref } from 'react';
import './landing-pricing.scss';

import Testimonials, { TestimonialsP } from './testimonials';
import Prices, { PricesP } from './prices';
import Footer from './footer';

interface PricingBaseP extends TestimonialsP, PricesP {}

interface PricingP extends PricingBaseP {
  reff: Ref<HTMLElement>;
}

const LandingPricing = ({ testimonialsHeader, testimonials, pricingHeader, prices, reff }: PricingP) => (
  <section className={'landing-pricing-screen'} ref={reff}>
    <Testimonials testimonialsHeader={testimonialsHeader} testimonials={testimonials} />
    <Prices pricingHeader={pricingHeader} prices={prices} />
    <Footer />
  </section>
);

export type { PricingBaseP, PricingP };
export default LandingPricing;
