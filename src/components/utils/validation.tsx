import { validateSync, MinLength, IsEmail, ValidationError } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setField<O>(obj: O, key: keyof any, value: any) {
  if (!hasKey(obj, key)) throw Error(`no ${String(key)} in ${obj}`);

  obj[key] = value;
}

function map<O, V>(obj: O, functor: (key: string, value: V) => void) {
  if (obj) Object.entries(obj).forEach(([key, value]) => functor(key, value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const varName = (var_: any) => Object.keys(var_)[0];

export class LoginFormV {
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string | undefined;
  @MinLength(8, { message: 'Password must be at least 8 symbols long' })
  password: string | undefined;

  static validateEmail = (email: string): string => {
    return LoginFormV._validationResultOf(varName({ email }), email);
  };

  static validatePassword = (password: string): string => {
    return LoginFormV._validationResultOf(varName({ password }), password);
  };

  static _validateField(field: string, value: string): ValidationError | undefined {
    const f = new LoginFormV();
    setField(f, field, value);
    return validateSync(f).find((e) => e.property === field);
  }
  static _firstError(error: ValidationError | undefined): string {
    if (!error) return '';

    let errorStr = '';
    map(error.constraints, (e, v) => (errorStr += v));

    return errorStr;
  }
  static _validationResultOf(field: string, value: string) {
    return LoginFormV._firstError(LoginFormV._validateField(field, value));
  }
}
