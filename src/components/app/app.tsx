import React from 'react';
import { Helmet } from 'react-helmet';

import { Landing, LandingP, SignUp } from '../pages';

const App = ({ hero, features, pricing }: LandingP) => {
  return (
    <>
      <Helmet>
        <title>Uni</title>
        <style>{'body { background-color: #F5F8FB; }'}</style>
      </Helmet>
      {/*<Landing hero={hero} features={features} pricing={pricing} />*/}
      <SignUp />
    </>
  );
};

export default App;
