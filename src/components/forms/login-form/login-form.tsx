import './login-form.scss';
import React, { useState } from 'react';
import { preventAndCall } from '../../../utils/events';
import { ValidatedEmail, ValidatedPassword } from '../input-field-v';
import Alert from '../../utils';
import { useHistory } from 'react-router-dom';
import { LoginFormV, SignUpFormV } from '../../../validation/login-form';

const useVStates = (name: string) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [activation, setActivation] = useState(false);
  const emptyActivation = () => {
    setActivation(true);
    setError(`Enter ${name}`);
  };

  return { value, setValue, error, setError, activation, setActivation, emptyActivation };
};

const WrongCredentialsAlert = Alert('danger', 'Wrong login or password');

const LoginForm = () => {
  const login = useVStates('email');
  const password = useVStates('password');
  const [wrongCredentials] = useState(false);
  const onSubmit = () => {
    if (!login.activation) login.emptyActivation();
    if (!password.activation) password.emptyActivation();
  };
  return (
    <>
      {WrongCredentialsAlert(wrongCredentials)}
      <form onSubmit={preventAndCall(onSubmit)}>
        <ValidatedEmail
          error={[login.error, login.setError]}
          activation={[login.activation, login.setActivation]}
          value={[login.value, login.setValue]}
          validator={LoginFormV.validateEmail}
        />
        <ValidatedPassword
          error={[password.error, password.setError]}
          activation={[password.activation, password.setActivation]}
          value={[password.value, password.setValue]}
          validator={LoginFormV.validatePassword}
        />
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    </>
  );
};

export default LoginForm;
