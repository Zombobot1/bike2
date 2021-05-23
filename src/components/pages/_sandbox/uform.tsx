import { voidP } from '../../../utils/types';
import { useMount } from '../../../utils/hooks-utils';
import { atom, useAtom } from 'jotai';
import { CardEstimation } from '../../study/training/types';

export interface UFieldInfo {
  value: string;
  validationError: string;
  showAnswer: boolean;
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

type OnSubmit = (estimations: Estimations) => voidP;

const onSubmitDefault = async (_: Estimations) => Promise.resolve();

const _required = (value: string): string => (value ? '' : 'This is a required field!');

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.value) }));

const _check = (fields: UFields): UFields =>
  fields.map((f) => ({ ...f, estimation: f.value === f.correctAnswer ? 'GOOD' : 'BAD', showAnswer: true }));

const _estimations = (fields: UFields): Estimations => {
  return fields.map(({ name, value, estimation }) => ({ name, value, estimation: estimation || 'BAD' }));
};

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError);

class UFormState {
  fields: UFields = [];
  handleSubmit = onSubmitDefault;
}

export const uformState = atom(new UFormState());

export const useUForm = (onSubmit?: OnSubmit) => {
  const [form, setForm] = useAtom(uformState);
  const mutateFields = (f: (old: UFields) => UFields) => setForm((form) => ({ ...form, fields: f(form.fields) }));
  const setFields = (fields: UFields) => setForm((f) => ({ ...f, fields }));
  const { fields, handleSubmit } = form;

  const addField = (name: string, correctAnswer: string) => {
    mutateFields((old) => [
      ...old,
      {
        name,
        correctAnswer,
        value: '',
        validator: _required,
        validationError: '',
        showAnswer: false,
      },
    ]);
  };

  const removeField = (name: string) => {
    mutateFields((old) => old.filter((f) => f.name !== name));
  };

  const onChange = (name: string, value: string) => {
    mutateFields((old) =>
      old.map((f) => (f.name === name ? { ...f, value: value, validationError: f.validator(value) } : f)),
    );
  };

  const getFieldInfo = (name: string): UFieldInfo => {
    const result = fields.find((f) => f.name === name);
    if (!result) return { validationError: '', value: '', showAnswer: false };
    return result;
  };

  const submit = async () => {
    const validatedFields = _validate(fields);
    if (!_isValid(validatedFields)) return setFields(validatedFields);

    const checkedFields = _check(validatedFields);
    setFields(checkedFields);
    await handleSubmit(_estimations(fields));
  };

  useMount(() => {
    if (onSubmit) setForm((f) => ({ ...f, handleSubmit: onSubmit }));
  });

  return {
    getFieldInfo,
    addField,
    removeField,
    onChange,
    submit,
  };
};
