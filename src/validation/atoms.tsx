import { IsEmail } from 'class-validator';
import { validate } from './basics';

export class EmailV {
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string | undefined;

  static validateEmail(email: string): string {
    return validate('email', { email }, EmailV);
  }
}
