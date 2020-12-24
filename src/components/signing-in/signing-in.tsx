import './signing-up.scss';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../forms/login-form';

import { ReactComponent as Google } from '../shared-icons/google.svg';
import { ReactComponent as Guy } from './guy.svg';
import { ReactComponent as Girl } from './girl.svg';

const SigningIn = () => {
  const history = useHistory();
  const toSignUp = () => history.push('/signup', { from: '/signin' });
  return (
    <div className={'sign-up-container'}>
      <Guy />
      <Girl />
      <div className={'sign-up-card'}>
        <h2 className={'sign-up-card__header'}>Sign in to Uni</h2>
        <LoginForm />
        <p className={'login-with'}>or login with</p>
        <div className={'d-flex justify-content-center'}>
          <button className={'btn-google btn btn-outline-primary'}>
            <Google />
            Google
          </button>
        </div>
        <div className={'not-registered'}>
          <p>Not registered?</p>
          <a onClick={toSignUp}>Create account</a>
        </div>
      </div>
    </div>
  );
};

export default SigningIn;
