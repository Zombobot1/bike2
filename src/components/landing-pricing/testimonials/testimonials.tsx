import Testimonial, { TestimonialP } from '../testimonial';
import React, { useState } from 'react';
import './testimonials.scss';

import { ReactComponent as ChevronLeft } from './chevron-left.svg';
import { ReactComponent as ChevronRight } from './chevron-right.svg';

interface TestimonialsP {
  testimonialsHeader: string;
  testimonials: TestimonialP[];
}

const Testimonials = ({ testimonialsHeader, testimonials }: TestimonialsP) => {
  const [current, setCurrent] = useState(0);
  const tlen = testimonials.length;
  const increment = () => setCurrent((c) => (c += 1) % tlen);
  const decrement = () => setCurrent((c) => Math.abs((c -= 1)) % tlen);
  return (
    <>
      <h2 className={'testimonials-subheader'}>{testimonialsHeader}</h2>
      <div className={'testimonials'}>
        {testimonials.map((e, i) => Testimonial(e, i, current))}
        <button>
          <ChevronLeft onClick={decrement} />
        </button>
        <button>
          <ChevronRight onClick={increment} />
        </button>
      </div>
    </>
  );
};

export default Testimonials;
export type { TestimonialsP };
