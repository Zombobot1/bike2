import { validateSync, ValidationError } from 'class-validator';
import { map, setField, varName } from '../utils/objects';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateField = (field: string, value: string, validator: any): ValidationError | undefined => {
  const f = new validator();
  setField(f, field, value);
  return validateSync(f).find((e) => e.property === field);
};
const firstError = (error: ValidationError | undefined): string => {
  if (!error) return '';

  const errorStr: string[] = [];
  map(error.constraints, (e, v) => errorStr.push(String(v)));

  return errorStr[0];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (fieldAndValue: any, validator: any) => {
  const fieldName = varName(fieldAndValue);
  return firstError(validateField(fieldName, fieldAndValue[fieldName], validator));
};
