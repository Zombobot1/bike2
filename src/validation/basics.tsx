import { validateSync, ValidationError } from 'class-validator';
import { map, setField, varName } from '../utils/objects';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateField = (field: string, fieldsAndValue: any, validator: any): ValidationError | undefined => {
  const validatingObject = new validator();
  map(fieldsAndValue, (f, v) => setField(validatingObject, f, v));
  return validateSync(validatingObject).find((e) => e.property === field);
};
const firstError = (error: ValidationError | undefined): string => {
  if (!error) return '';

  const errorStr: string[] = [];
  map(error.constraints, (e, v) => errorStr.push(String(v)));

  return errorStr[0];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (field: string, fieldsAndValue: any, validator: any) => {
  return firstError(validateField(field, fieldsAndValue, validator));
};
