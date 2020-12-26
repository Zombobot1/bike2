import { useStrInput } from '../../hooks/use-validation';
import { SignUpFormV } from '../../../../validation/sign-up-form';
import { submit } from '../../utils';
import { ValidatedConfirmedPassword, ValidatedPassword } from '../../validated-fields';
import SubmitBtn from '../../submit-btn';
import React from 'react';

const ResetPasswordForm = () => {
  const password = useStrInput('password', SignUpFormV.validatePassword);
  const confirmationV = (v: string) => SignUpFormV.confirmPassword(password.value[0], v);
  const confirmedPassword = useStrInput('confirmation', confirmationV);
  return (
    <form className="form" onSubmit={submit([password, confirmedPassword])}>
      <ValidatedPassword {...password} />
      <ValidatedConfirmedPassword {...confirmedPassword} />
      <SubmitBtn className={'mt-4'} text="Reset password" />
    </form>
  );
};

export default ResetPasswordForm;
