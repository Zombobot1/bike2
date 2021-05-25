import { useMount } from '../../../utils/hooks-utils';
import { atom, useAtom } from 'jotai';
import { CardEstimation } from '../../study/training/types';

export interface UFieldInfo {
  value: string;
  validationError: string;
  wasSubmitted: boolean;
}

export interface UField extends UFieldInfo {
  name: string;
  validator: (value: string) => string;
  correctAnswer: string;
  estimation?: CardEstimation;
}
export type UFields = UField[];

export interface Estimation {
  name: string;
  value: string;
  estimation: CardEstimation;
}
export type Estimations = Estimation[];

type OnSubmit = (estimations: Estimations) => void;

const onSubmitDefault = (_: Estimations) => {};

const _required = (value: string): string => (value ? '' : 'This is a required field!');

const FIELD: UField = {
  name: '',
  correctAnswer: '',
  value: '',
  validator: _required,
  validationError: '',
  wasSubmitted: false,
};

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.value) }));

const _check = (fields: UFields): UFields =>
  fields.map(
    (f): UField => ({
      ...f,
      estimation: f.value === f.correctAnswer ? 'GOOD' : 'BAD',
      wasSubmitted: true,
    }),
  );

const _estimations = (fields: UFields): Estimations => {
  return fields.map(({ name, value, estimation }) => ({ name, value, estimation: estimation || 'BAD' }));
};

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError);

export const fieldsAtom = atom<UFields>([]);
export const handleSubmitAtom = atom({ onSubmit: onSubmitDefault });

export const useUForm = (onSubmit?: OnSubmit) => {
  const [fields, setFields] = useAtom(fieldsAtom);
  const [handleSubmit, setHandleSubmit] = useAtom(handleSubmitAtom);

  const addField = (name: string, correctAnswer: string) => {
    setFields((old) => [...old, { ...FIELD, name, correctAnswer }]);
  };

  const removeField = (name: string) => {
    setFields((old) => old.filter((f) => f.name !== name));
  };

  const onChange = (name: string, value: string) => {
    setFields((old) =>
      old.map((f) => (f.name === name ? { ...f, value: value, validationError: f.validator(value) } : f)),
    );
  };

  const getFieldInfo = (name: string): UFieldInfo => {
    const result = fields.find((f) => f.name === name);
    if (!result) return { ...FIELD };
    return result;
  };

  const submit = () => {
    const validatedFields = _validate(fields);
    if (!_isValid(validatedFields)) return setFields(validatedFields);

    const checkedFields = _check(validatedFields);
    setFields(checkedFields);
    handleSubmit.onSubmit(_estimations(checkedFields));
  };

  useMount(() => {
    if (onSubmit) setHandleSubmit({ onSubmit });
  });

  return {
    getFieldInfo,
    addField,
    removeField,
    onChange,
    submit,
    isSubmitted: false,
  };
};
