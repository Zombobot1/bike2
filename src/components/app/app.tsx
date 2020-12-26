import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ForgotPassword, Landing, LandingP, PAGES, SignIn, SignUp } from '../pages';
import { ResetPassword } from '../pages';
import { Sandbox } from '../pages';

const App = ({ hero, features, pricing }: LandingP) => {
  return (
    <Switch>
      <Route path={PAGES.signUp} component={SignUp} />
      <Route path={PAGES.forgotPassword} component={ForgotPassword} />
      <Route path={PAGES.resetPassword} component={ResetPassword} />
      <Route path={PAGES.signIn} component={SignIn} />
      <Route path={PAGES.landing} render={() => <Landing hero={hero} features={features} pricing={pricing} />} />
      <Route path={PAGES._sandbox} component={Sandbox} />
    </Switch>
  );
};

export default App;
