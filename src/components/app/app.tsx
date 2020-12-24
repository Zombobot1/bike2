import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import { Landing, LandingP, SignIn, SignUp } from '../pages';

const App = ({ hero, features, pricing }: LandingP) => {
  return (
    <>
      <Helmet>
        <title>Uni</title>
        <style>{'body { background-color: #F5F8FB; }'}</style>
      </Helmet>
      <Switch>
        <Route path={'/signup'} component={SignUp} />
        <Route path={'/lostpassword'} render={() => <div>Lost</div>} />
        <Route path={'/signin'} component={SignIn} />
        <Route path={'/landing'} render={() => <Landing hero={hero} features={features} pricing={pricing} />} />
      </Switch>
    </>
  );
};

export default App;
