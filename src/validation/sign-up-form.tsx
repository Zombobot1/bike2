import { Match } from './match';
import { Equals } from 'class-validator';
import { validate } from './basics';
import { LoginFormV } from './login-form';

export class SignUpFormV extends LoginFormV {
  @Match('password', { message: 'Passwords must match' })
  confirmedPassword: string | undefined;
  @Equals(true, { message: 'You must agree with them' })
  terms: boolean | undefined;

  static confirmPassword(password: string, confirmedPassword: string): string {
    return validate('confirmedPassword', { password, confirmedPassword }, SignUpFormV);
  }

  static validateTerms(terms: boolean): string {
    return validate('terms', { terms }, SignUpFormV);
  }
}
