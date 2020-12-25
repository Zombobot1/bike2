import './password-management.scss';
import React from 'react';

import { ReactComponent as Girl } from '../../images/standing-girl.svg';
import { ReactComponent as ChevronLeft } from '../../icons/chevron-left.svg';
import SubmitBtn from '../../forms/submit-btn';
import { useStrInput } from '../../forms/hooks/use-validation';
import { LoginFormV } from '../../../validation/login-form';
import { ValidatedConfirmedPassword, ValidatedEmail, ValidatedPassword } from '../../forms/validated-fields';
import { submit } from '../../forms/utils';
import { Link } from 'react-router-dom';
import { PAGES } from '../index';
import { SignUpFormV } from '../../../validation/sign-up-form';

const ResetPassword = () => {
  const password = useStrInput('password', SignUpFormV.validatePassword);
  const confirmationV = (v: string) => SignUpFormV.confirmPassword(password.value[0], v);
  const confirmedPassword = useStrInput('confirmation', confirmationV);
  return (
    <>
      <div className="forgot-password-container d-flex flex-column">
        <Link className="back-to align-self-center" to={PAGES.signIn}>
          <ChevronLeft />
          <a>Back to log in</a>
        </Link>
        <div className="forgot-password-card align-self-center">
          <h2 className="card__header">Reset password</h2>
          <form onSubmit={submit([password, confirmedPassword])}>
            <ValidatedPassword {...password} />
            <ValidatedConfirmedPassword {...confirmedPassword} />
            <SubmitBtn text="Reset password" />
          </form>
        </div>
      </div>
      <Girl />
    </>
  );
};
export { ResetPassword };
