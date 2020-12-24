import { IsEmail, MinLength } from 'class-validator';
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
