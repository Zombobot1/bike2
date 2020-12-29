import '../common.scss';
import './login-form.scss';
import React from 'react';
import { useNotEmptyStrInput } from '../../hooks/use-validation';
import SubmitBtn from '../../submit-btn';
import { submit } from '../../utils';
import { Link } from 'react-router-dom';
import { EmptyValidatedEmail, EmptyValidatedPassword } from '../../validated-fields/validated-fields';
import { LOSTPASSWORD } from '../../../pages';

const LoginForm = () => {
  const email = useNotEmptyStrInput('email');
  const password = useNotEmptyStrInput('password');
  return (
    <form className="form" onSubmit={submit([email, password])}>
      <EmptyValidatedEmail {...email} />
      <EmptyValidatedPassword {...password} />
      <Link className="lost-password" to={LOSTPASSWORD}>
        Lost password?
      </Link>
      <SubmitBtn />
    </form>
  );
};

export default LoginForm;
