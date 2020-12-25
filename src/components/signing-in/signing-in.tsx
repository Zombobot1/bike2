import './signing-in.scss';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Guy } from '../images/reading-guy-and-girl.svg';
import { ReactComponent as Girl } from '../images/reading-girl.svg';
import { LoginWithAlert } from '../forms/hoc/login-with-alert';
import LoginOptions from '../forms/login-options';

const SigningIn = () => {
  const history = useHistory();
  const toSignUp = () => history.push('/signup', { from: '/signin' });
  return (
    <div className={'sign-container'}>
      <Guy />
      <Girl />
      <div className={'sign-in-card'}>
        <h2 className={'sign-card__header'}>Sign in to Uni</h2>
        <LoginWithAlert />
        <LoginOptions text="or login with" />
        <div className={'alternative'}>
          <p>Not registered?</p>
          <a onClick={toSignUp}>Create account</a>
        </div>
      </div>
    </div>
  );
};

export default SigningIn;
