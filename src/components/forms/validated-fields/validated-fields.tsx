import './validated-fields.scss';
import Envelope from '../../icons/envelope.svg';
import Unlock from '../../icons/unlock.svg';
import { withValidation, WithValidationP } from '../hoc/with-validation';
import { compose } from 'redux';
import InputField from '../input-field/input-field';
import CheckBoxField from '../checkbox-field';
import { FC } from 'react';

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

const confirmedPasswordConfig = {
  label: 'Confirm Password',
  id: 'inputCPassword',
  placeholder: 'Password',
  type: 'password',
  icon: Unlock,
};

const termsConfig = {
  id: 'termschecked',
  label: 'You agree with terms and conditions',
};

type FCV = FC<WithValidationP<string>>;
type FCVBool = FC<WithValidationP<boolean>>;
export const ValidatedEmail = compose(withValidation, InputField)(emailConfig) as FCV;
export const ValidatedPassword = compose(withValidation, InputField)(passwordConfig) as FCV;
export const ValidatedConfirmedPassword = compose(withValidation, InputField)(confirmedPasswordConfig) as FCV;
export const ValidatedTerms = compose(withValidation, CheckBoxField)(termsConfig) as FCVBool;
