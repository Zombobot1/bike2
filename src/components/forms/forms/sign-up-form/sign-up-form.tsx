import '../form.scss';
import { useBoolInput, useStrInput } from '../../hooks/use-validation';
import { submit } from '../../utils';
import { ValidatedConfirmedPassword, ValidatedEmail, ValidatedPassword, ValidatedTerms } from '../../validated-fields';
import SubmitBtn from '../../submit-btn';
import React from 'react';
import { SignUpFormV } from '../../../../validation/sign-up-form';
import { compose } from 'redux';
import { FootlessModal } from '../../../utils/footless-modal';

const Terms = () => <p>We do not have terms and conditions so far.</p>;

const TermsModal = compose(FootlessModal({ id: 'terms', title: 'Terms and conditions' }))(Terms);

const SignUpForm = () => {
  const email = useStrInput('email', SignUpFormV.validateEmail);
  const password = useStrInput('password', SignUpFormV.validatePassword);
  const confirmationV = (v: string) => SignUpFormV.confirmPassword(password.value[0], v);
  const confirmedPassword = useStrInput('confirmation', confirmationV);
  const terms = useBoolInput('confirmation', SignUpFormV.validateTerms);

  return (
    <form className="form" onSubmit={submit([email, password, confirmedPassword, terms])}>
      <ValidatedEmail {...email} />
      <ValidatedPassword {...password} />
      <ValidatedConfirmedPassword {...confirmedPassword} />
      <div className="terms-agreement">
        <ValidatedTerms {...terms} />
        <a href="#" data-bs-toggle="modal" data-bs-target="#terms">
          Read more
        </a>
        <TermsModal />
      </div>
      <SubmitBtn />
    </form>
  );
};

export default SignUpForm;
