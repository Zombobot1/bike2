import './password-management.scss';
import React from 'react';

import { ReactComponent as Girl } from '../../images/standing-girl.svg';
import { ReactComponent as ChevronLeft } from '../../icons/chevron-left.svg';
import SubmitBtn from '../../forms/submit-btn';
import { useStrInput } from '../../forms/hooks/use-validation';
import { LoginFormV } from '../../../validation/login-form';
import { ValidatedEmail } from '../../forms/validated-fields';
import { submit } from '../../forms/utils';
import { Link } from 'react-router-dom';
import { PAGES } from '../index';

const chillingText = "Don't fret! Just type in your email and we will send you a code to reset your password!";

const ForgotPassword = () => {
  const login = useStrInput('email', LoginFormV.validateEmail);
  return (
    <>
      <div className="forgot-password-container d-flex flex-column">
        <Link className="back-to align-self-center" to={PAGES.signIn}>
          <ChevronLeft />
          <a>Back to log in</a>
        </Link>
        <div className="forgot-password-card align-self-center">
          <h2 className="card__header">Forgot your password?</h2>
          <p>{chillingText}</p>
          <form onSubmit={submit([login])}>
            <ValidatedEmail {...login} />
            <SubmitBtn text="Recover password" />
          </form>
        </div>
      </div>
      <Girl />
    </>
  );
};
export { ForgotPassword };
