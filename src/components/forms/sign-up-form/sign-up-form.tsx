import './sign-up-form.scss';
import { useBoolInput, useStrInput } from '../hooks/use-validation';
import { submit } from '../utils';
import { ValidatedConfirmedPassword, ValidatedEmail, ValidatedPassword, ValidatedTerms } from '../validated-fields';
import SubmitBtn from '../submit-btn';
import React from 'react';
import { SignUpFormV } from '../../../validation/sign-up-form';

const SignUpForm = () => {
  const email = useStrInput('email', SignUpFormV.validateEmail);
  const password = useStrInput('password', SignUpFormV.validatePassword);
  const confirmationV = (v: string) => SignUpFormV.confirmPassword(password.value[0], v);
  const confirmedPassword = useStrInput('confirmation', confirmationV);
  const terms = useBoolInput('confirmation', SignUpFormV.validateTerms);

  return (
    <form className="login-form" onSubmit={submit([email, password, confirmedPassword, terms])}>
      <ValidatedEmail {...email} />
      <ValidatedPassword {...password} />
      <ValidatedConfirmedPassword {...confirmedPassword} />
      <ValidatedTerms {...terms} />
      <SubmitBtn />
    </form>
  );
};

export default SignUpForm;
