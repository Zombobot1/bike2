import './signing-up.scss';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Guy } from '../images/guy.svg';
import { ReactComponent as Girl } from '../images/girl.svg';
import LoginOptions from '../forms/login-options';
import { SignUpWithAlert } from '../forms/hoc/sign-up-with-alert';

const SigningUp = () => {
  const history = useHistory();
  const toSignIn = () => history.push('/signin', { from: '/signup' });
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
          <a onClick={toSignIn}>Login here</a>
        </div>
      </div>
    </div>
  );
};

export default SigningUp;
