import { useStrInput } from '../../forms/hooks/use-validation';
import { SignUpFormV } from '../../../validation/sign-up-form';
import { submit } from '../../forms/utils';
import { ValidatedConfirmedPassword, ValidatedPassword } from '../../forms/validated-fields';
import SubmitBtn from '../../forms/submit-btn';
import React from 'react';

const ResetPasswordCard = () => {
  const password = useStrInput('password', SignUpFormV.validatePassword);
  const confirmationV = (v: string) => SignUpFormV.confirmPassword(password.value[0], v);
  const confirmedPassword = useStrInput('confirmation', confirmationV);
  return (
    <div className="forgot-password-card align-self-center">
      <h2 className="card__header">Reset password</h2>
      <form onSubmit={submit([password, confirmedPassword])}>
        <ValidatedPassword {...password} />
        <ValidatedConfirmedPassword {...confirmedPassword} />
        <SubmitBtn text="Reset password" />
      </form>
    </div>
  );
};

export default ResetPasswordCard;
