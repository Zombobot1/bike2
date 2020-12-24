import './signing-up.scss';
import React, { ChangeEvent, useState, FC } from 'react';
import { compose } from 'redux';

import { ReactComponent as Google } from '../shared-icons/google.svg';
import { ReactComponent as Guy } from './guy.svg';
import { ReactComponent as Girl } from './girl.svg';
import Envelope from '../shared-icons/envelope.svg';
import Unlock from '../shared-icons/unlock.svg';
import { LoginFormV } from '../utils/validation';

type OnChange = (e: ChangeEvent<HTMLInputElement>) => void;

type ValidatedInputFieldP = {
  state: () => string;
  onChange: OnChange;
  errorStr: string;
};

type ValidatedInputFC = FC<ValidatedInputFieldP>;

type InputConfiguration = {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  icon: string;
};

const emailConfig = {
  label: 'Your Email',
  id: 'inputEmail',
  placeholder: 'example@company.com',
  type: 'email',
  icon: Envelope,
};

const passwordConfig = {
  label: 'Password',
  id: 'inputPassword',
  placeholder: 'Password',
  type: 'password',
  icon: Unlock,
};

const InputField = (config: InputConfiguration) => ({ state, onChange, errorStr }: ValidatedInputFieldP) => {
  const { id, label, placeholder, type, icon } = config;
  return (
    <div className="form-group email-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-icon">
        <img src={icon} alt="i" className={`e-${type}`} />
        <input type={type} className={'form-control' + state()} id={id} placeholder={placeholder} onChange={onChange} />
        <div className="invalid-feedback">{errorStr}</div>
      </div>
    </div>
  );
};
type ValidationF = (d: string) => string;

type StateT<T> = [T, React.Dispatch<React.SetStateAction<T>>];
type StrStateT = StateT<string>;
type BoolStateT = StateT<boolean>;

type WithValidationP = {
  error: StrStateT;
  activation: BoolStateT;
};

const withValidation = (validator: ValidationF) => (Base: ValidatedInputFC) => (props: WithValidationP) => {
  const [errorStr, setErrorStr] = props.error;
  const [wasActivated, setWasActivated] = props.activation;
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWasActivated((p) => Boolean(value || p));
    setErrorStr(validator(value));
  };
  const state = () => {
    if (!wasActivated) return '';
    if (errorStr) return ' is-invalid';
    return ' is-valid';
  };
  const p = { state, onChange, errorStr };
  return <Base {...p} />;
};

type RFC<T = Record<string, never>> = (props: T) => JSX.Element;
type RFCV = RFC<WithValidationP>;
const ValidatedEmail = compose(withValidation(LoginFormV.validateEmail), InputField)(emailConfig) as RFCV;
const ValidatedPassword = compose(withValidation(LoginFormV.validatePassword), InputField)(passwordConfig) as RFCV;

const Alert = (isVisisble: boolean) => (
  <div className={`alert alert-danger text-center ${!isVisisble ? 'invisible' : ''}`} role="alert">
    Wrong login or password
  </div>
);

const LoginForm = () => {
  const [loginError, setLoginError] = useState('');
  const [loginActivation, setLoginActivation] = useState(false);
  const emptyLoginActivation = () => {
    setLoginActivation(true);
    setLoginError('Enter email');
  };

  const [passwordError, setPasswordError] = useState('');
  const [passwordActivation, setPasswordActivation] = useState(false);
  const emptyPasswordActivation = () => {
    setPasswordActivation(true);
    setPasswordError('Enter password');
  };

  const [wrongCredentials] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loginActivation) emptyLoginActivation();
    if (!passwordActivation) emptyPasswordActivation();
  };
  return (
    <>
      {Alert(wrongCredentials)}
      <form onSubmit={onSubmit}>
        <ValidatedEmail error={[loginError, setLoginError]} activation={[loginActivation, setLoginActivation]} />
        <ValidatedPassword
          error={[passwordError, setPasswordError]}
          activation={[passwordActivation, setPasswordActivation]}
        />
        <a className={'lost-password'}>Lost password?</a>
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    </>
  );
};

const SigningUp = () => {
  return (
    <div className={'sign-up-container'}>
      <Guy />
      <Girl />
      <div className={'sign-up-card'}>
        <h2 className={'sign-up-card__header'}>Sign in to Uni</h2>
        <LoginForm />
        <p className={'login-with'}>or login with</p>
        <div className={'d-flex justify-content-center'}>
          <button className={'btn-google btn btn-outline-primary'}>
            <Google />
            Google
          </button>
        </div>
        <div className={'not-registered'}>
          <p>Not registered?</p>
          <a>Create account</a>
        </div>
      </div>
    </div>
  );
};

export default SigningUp;
