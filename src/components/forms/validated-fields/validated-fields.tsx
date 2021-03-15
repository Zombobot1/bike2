import './validated-fields.scss';
import Envelope from '../../icons/envelope.svg';
import Unlock from '../../icons/unlock.svg';
import { withValidation, WithValidationBaseP, WithValidationP } from '../hoc/with-validation';
import InputField from '../input-field/input-field';
import CheckBoxField from '../checkbox-field';
import { FC } from 'react';
import TextAreaField from '../text-area-field';
import { withEmptyValidation } from '../hoc/with-empty-validation';
import compose from '../../../utils/utils';

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

const messageConfig = {
  id: 'message',
  label: 'Message',
  rows: 6,
};

type FCV = FC<WithValidationP<string>>;
type FCEV = FC<WithValidationBaseP<string>>;
type FCVBool = FC<WithValidationP<boolean>>;
export const ValidatedEmail = compose(withValidation, InputField)(emailConfig) as FCV;
export const EmptyValidatedEmail = compose(withEmptyValidation, InputField)(emailConfig) as FCEV;
export const ValidatedPassword = compose(withValidation, InputField)(passwordConfig) as FCV;
export const EmptyValidatedPassword = compose(withEmptyValidation, InputField)(passwordConfig) as FCEV;
export const ValidatedConfirmedPassword = compose(withValidation, InputField)(confirmedPasswordConfig) as FCV;
export const ValidatedTerms = compose(withValidation, CheckBoxField)(termsConfig) as FCVBool;
export const ValidatedTextArea = compose(withValidation, TextAreaField)(messageConfig) as FCV;
