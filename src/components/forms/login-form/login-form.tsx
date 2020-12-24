import './login-form.scss';
import React from 'react';
import { ValidatedEmail, ValidatedPassword } from '../validated-fields';
import { useStrInput } from '../hooks/use-validation';
import SubmitBtn from '../submit-btn';
import { submit } from '../utils';
import { LoginFormV } from '../../../validation/login-form';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
  const login = useStrInput('email', LoginFormV.validateEmail);
  const password = useStrInput('password', LoginFormV.validatePassword);
  const history = useHistory();
  const toPasswordReset = () => history.push('/lostpassword', { from: 'signin' });
  return (
    <form onSubmit={submit([login, password])}>
      <ValidatedEmail {...login} />
      <ValidatedPassword {...password} />
      <a className="lost-password" onClick={toPasswordReset}>
        Lost password?
      </a>
      <SubmitBtn />
    </form>
  );
};

export default LoginForm;
