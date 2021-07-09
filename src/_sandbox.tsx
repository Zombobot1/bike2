import React from 'react';
import 'swiper/swiper.scss';

export const Sandbox = () => {
  return (
    <div style={{ position: 'relative', width: '500px', height: '500px', backgroundColor: 'grey' }}>
      <div style={{ zIndex: 1, position: 'fixed', width: '50px', height: '50px', backgroundColor: 'red' }} />
      <div style={{ position: 'fixed', width: '100px', height: '100px', backgroundColor: 'blue' }} />
    </div>
  );
};
