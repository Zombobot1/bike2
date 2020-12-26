import { Match } from './match';
import { Equals, IsEmail, MinLength } from 'class-validator';
import { validate, validateOne } from './basics';

export class SignUpFormV {
  @IsEmail({}, { message: 'Enter a valid email' })
  email = '';
  @MinLength(8, { message: 'Password must be at least 8 symbols long' })
  password = '';
  @Match('password', { message: 'Passwords must match' })
  confirmedPassword = '';
  @Equals(true, { message: 'You must agree with them' })
  terms: boolean | undefined;

  static validateEmail(email: string): string {
    return validateOne({ email }, SignUpFormV);
  }
  static validatePassword(password: string): string {
    return validateOne({ password }, SignUpFormV);
  }
  static confirmPassword(password: string, confirmedPassword: string): string {
    return validate('confirmedPassword', { password, confirmedPassword }, SignUpFormV);
  }
  static validateTerms(terms: boolean): string {
    return validateOne({ terms }, SignUpFormV);
  }
}
