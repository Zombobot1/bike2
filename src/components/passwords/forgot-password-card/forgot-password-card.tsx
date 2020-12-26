import './forgot-password-card.scss';
import { useStrInput } from '../../forms/hooks/use-validation';
import { submit } from '../../forms/utils';
import { ValidatedEmail } from '../../forms/validated-fields';
import SubmitBtn from '../../forms/submit-btn';
import React from 'react';
import { EmailV } from '../../../validation/atoms';

const chillingText = "Don't fret! Just type in your email and we will send you a code to reset your password!";

const ForgotPasswordCard = () => {
  const email = useStrInput('email', EmailV.validateEmail);
  return (
    <div className="forgot-password-card align-self-center">
      <h2 className="card__header">Forgot your password?</h2>
      <p>{chillingText}</p>
      <form onSubmit={submit([email])}>
        <ValidatedEmail {...email} />
        <SubmitBtn text="Recover password" />
      </form>
    </div>
  );
};

export default ForgotPasswordCard;
