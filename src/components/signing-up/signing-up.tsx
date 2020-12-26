import './signing-up.scss';
import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Guy } from '../images/reading-guy-and-girl.svg';
import { ReactComponent as Girl } from '../images/reading-girl.svg';
import LoginOptions from '../forms/login-options';
import { SignUpWithAlert } from '../forms/hoc/sign-up-with-alert';
import { PAGES } from '../pages';

const SigningUp = () => {
  return (
    <div className={'sign-container'}>
      <Guy />
      <Girl />
      <div className={'sign-up-card'}>
        <h2 className={'sign-card__header'}>Create an account</h2>
        <SignUpWithAlert />
        <LoginOptions text={'or'} />
        <div className={'alternative'}>
          <p>Already have an account?</p>
          <Link to={PAGES.signIn}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default SigningUp;
