import './signing-up.scss';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Google } from '../shared-icons/google.svg';
import { ReactComponent as Guy } from './guy.svg';
import { ReactComponent as Girl } from './girl.svg';
import Alert from '../utils';
import { preventAndCall } from '../../utils/events';
import { ValidatedEmail, ValidatedPassword } from '../forms/input-field-v';
import { ValidatedConfirmedPassword } from '../forms/input-field-v/validated';
import { SignUpFormV } from '../../validation/login-form';
import { ValidatedInputFieldP } from '../forms/types';
import InputField, { InputConfigurationBase } from '../forms/input-field';
import { RFC, ValueUpdate } from '../../utils/types';
import { withValidation, WithValidationP } from '../forms/hoc/with-validation';
import { compose } from 'redux';

const useVStates = <T extends unknown>(name: string, initial: T) => {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState('');
  const [activation, setActivation] = useState(false);
  const emptyActivation = () => {
    setActivation(true);
    setError(`Enter ${name}`);
  };

  return { value, setValue, error, setError, activation, setActivation, emptyActivation };
};

const useVStatesStr = (name: string) => useVStates(name, '');
const useVStatesBool = (name: string) => useVStates(name, false);

const UserExistsAlert = Alert('danger', 'This user already exists');

const CheckBoxField = ({ label, id }: InputConfigurationBase) => ({
  state,
  onChange,
  errorStr,
  value,
}: ValidatedInputFieldP<boolean>) => {
  const onClick = () => onChange({ target: { value: !value } });
  return (
    <div className="form-check mt-4">
      <input className={'form-check-input' + state()} type="checkbox" onClick={onClick} id={id} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      <div className="invalid-feedback">{errorStr}</div>
    </div>
  );
};

const termsConfig = {
  id: 'termschecked',
  label: 'You agree with terms and conditions',
};

type RFCVBool = RFC<WithValidationP<boolean>>;
export const ValidatedTerms = compose(withValidation, CheckBoxField)(termsConfig) as RFCVBool;
const SignUpForm = () => {
  const login = useVStatesStr('email');
  const password = useVStatesStr('password');
  const confirmedPassword = useVStatesStr('confirmation');
  const terms = useVStatesBool('confirmation');
  const [userExists] = useState(false);
  const onSubmit = () => {
    if (!login.activation) login.emptyActivation();
    if (!password.activation) password.emptyActivation();
    if (!confirmedPassword.activation) confirmedPassword.emptyActivation();
    if (!terms.activation) terms.emptyActivation();
  };

  return (
    <>
      {UserExistsAlert(userExists)}
      <form onSubmit={preventAndCall(onSubmit)}>
        <ValidatedEmail
          error={[login.error, login.setError]}
          activation={[login.activation, login.setActivation]}
          value={[login.value, login.setValue]}
          validator={SignUpFormV.validateEmail}
        />
        <ValidatedPassword
          error={[password.error, password.setError]}
          activation={[password.activation, password.setActivation]}
          value={[password.value, password.setValue]}
          validator={SignUpFormV.validatePassword}
        />
        <ValidatedConfirmedPassword
          error={[confirmedPassword.error, confirmedPassword.setError]}
          activation={[confirmedPassword.activation, confirmedPassword.setActivation]}
          value={[confirmedPassword.value, confirmedPassword.setValue]}
          validator={(v: string) => SignUpFormV.confirmPassword(password.value, v)}
        />
        <ValidatedTerms
          error={[terms.error, terms.setError]}
          activation={[terms.activation, terms.setActivation]}
          value={[terms.value, terms.setValue]}
          validator={SignUpFormV.validateTerms}
        />
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    </>
  );
};

const SigningUp = () => {
  const history = useHistory();
  const toSignIn = () => history.push('/signin', { from: '/signup' });
  return (
    <div className={'sign-up-container'}>
      <Guy />
      <Girl />
      <div className={'sign-up-card'}>
        <h2 className={'sign-up-card__header'}>Create an account</h2>
        <SignUpForm />
        <p className={'login-with'}>or</p>
        <div className={'d-flex justify-content-center'}>
          <button className={'btn-google btn btn-outline-primary'}>
            <Google />
            Google
          </button>
        </div>
        <div className={'not-registered'}>
          <p>Already have an account?</p>
          <a onClick={toSignIn}>Login here</a>
        </div>
      </div>
    </div>
  );
};

export default SigningUp;
