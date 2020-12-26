import './login-form.scss';
import React from 'react';
import { useNotEmptyStrInput } from '../hooks/use-validation';
import SubmitBtn from '../submit-btn';
import { submit } from '../utils';
import { Link } from 'react-router-dom';
import { EmptyValidatedEmail, EmptyValidatedPassword } from '../validated-fields/validated-fields';
import { PAGES } from '../../pages';

const LoginForm = () => {
  const login = useNotEmptyStrInput('email');
  const password = useNotEmptyStrInput('password');
  return (
    <form className="login-form" onSubmit={submit([login, password])}>
      <EmptyValidatedEmail {...login} />
      <EmptyValidatedPassword {...password} />
      <Link className="lost-password" to={PAGES.forgotPassword}>
        Lost password?
      </Link>
      <SubmitBtn />
    </form>
  );
};

export default LoginForm;
