import React from 'react';

import { Landing, LandingP } from '../pages';

const App = ({ hero, features, pricing }: LandingP) => {
  return (
    <>
      <Landing hero={hero} features={features} pricing={pricing} />
    </>
  );
};

export default App;
