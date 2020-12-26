import { MinLength } from 'class-validator';
import { validate } from './basics';
import { EmailV } from './atoms';

export class ContactFormV extends EmailV {
  @MinLength(1, { message: 'Too short' })
  message: string | undefined;

  static validateMessage(message: string): string {
    return validate('message', { message }, ContactFormV);
  }
}
