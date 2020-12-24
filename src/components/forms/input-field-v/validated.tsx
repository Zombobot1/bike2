import './validated.scss';
import Envelope from '../../shared-icons/envelope.svg';
import Unlock from '../../shared-icons/unlock.svg';
import { RFC } from '../../../utils/types';
import { withValidation, WithValidationP } from '../hoc/with-validation';
import { compose } from 'redux';
import { LoginFormV } from '../../../validation/login-form';
import InputField from '../input-field/input-field';

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

type RFCV = RFC<WithValidationP>;
export const ValidatedEmail = compose(withValidation(LoginFormV.validateEmail), InputField)(emailConfig) as RFCV;
export const ValidatedPassword = compose(
  withValidation(LoginFormV.validatePassword),
  InputField,
)(passwordConfig) as RFCV;
