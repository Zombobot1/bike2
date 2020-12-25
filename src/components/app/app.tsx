import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import { ForgotPassword, Landing, LandingP, PAGES, SignIn, SignUp } from '../pages';
import { ResetPassword } from '../pages/reset-password';

const App = ({ hero, features, pricing }: LandingP) => {
  return (
    <>
      <Helmet>
        <title>Uni</title>
        <style>{'body { background-color: #F5F8FB; }'}</style>
      </Helmet>
      <Switch>
        <Route path={PAGES.signUp} component={SignUp} />
        <Route path={PAGES.forgotPassword} component={ForgotPassword} />
        <Route path={PAGES.root} component={ResetPassword} />
        <Route path={PAGES.signIn} component={SignIn} />
        <Route path={PAGES.landing} render={() => <Landing hero={hero} features={features} pricing={pricing} />} />
      </Switch>
    </>
  );
};

export default App;
