import './signing-in.scss';
import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Guy } from '../../images/reading-guy-and-girl.svg';
import { ReactComponent as Girl } from '../../images/reading-girl.svg';
import { LoginWithAlert } from '../../forms/hoc/login-with-alert';
import LoginOptions from '../../forms/login-options';
import { SIGNUP } from '../../pages';

const SigningIn = () => {
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
          <Link to={SIGNUP}>Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default SigningIn;
