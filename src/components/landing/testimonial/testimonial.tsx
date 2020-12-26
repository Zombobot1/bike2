import React from 'react';
import ManAvatar from './man-avatar.png';
import WomanAvatar from './woman-avatar.png';
import Man2Avatar from './man-2-avatar.png';
import './testimonial.scss';

type TestimonialP = {
  image: string;
  review: string;
  name: string;
};

const avatars = new Map([
  ['man', ManAvatar],
  ['woman', WomanAvatar],
  ['man-2', Man2Avatar],
]);

const Testimonial = ({ image, review, name }: TestimonialP, index: number, current: number) => {
  const className = 'testimonial' + (index !== current ? '--hidden' : '');
  return (
    <div className={className} key={index}>
      <img src={avatars.get(image)} alt={'user'} />
      <pre>{review}</pre>
      <h4>{name}</h4>
    </div>
  );
};

export default Testimonial;
export type { TestimonialP };
