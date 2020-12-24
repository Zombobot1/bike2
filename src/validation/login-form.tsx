import { Equals, IsEmail, MinLength } from 'class-validator';
import { Match } from './match';
import { validate } from './basics';

export class LoginFormV {
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string | undefined;
  @MinLength(8, { message: 'Password must be at least 8 symbols long' })
  password: string | undefined;

  static validateEmail(email: string): string {
    return validate('email', { email }, LoginFormV);
  }

  static validatePassword(password: string): string {
    return validate('password', { password }, LoginFormV);
  }
}

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
