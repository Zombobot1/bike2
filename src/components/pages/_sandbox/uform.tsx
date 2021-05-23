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

type OnSubmit = (estimations: Estimations) => void;

const onSubmitDefault = (_: Estimations) => {};

const _required = (value: string): string => (value ? '' : 'This is a required field!');

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.value) }));

const _check = (fields: UFields): UFields =>
  fields.map(
    (f): UField => ({
      ...f,
      estimation: f.value === f.correctAnswer ? 'GOOD' : 'BAD',
      showAnswer: true,
    }),
  );

const _estimations = (fields: UFields): Estimations => {
  return fields.map(({ name, value, estimation }) => ({ name, value, estimation: estimation || 'BAD' }));
};

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError);

const _hideAnswers = (fields: UFields): UFields => {
  return fields.map((f) => ({ ...f, showAnswer: false }));
};

export class UFormState {
  fields: UFields = [];
  handleSubmit = onSubmitDefault;
  isSubmitted = false;
}

export const uformAtom = atom(new UFormState());

export const useUForm = (onSubmit?: OnSubmit) => {
  const [form, setForm] = useAtom(uformAtom);
  const { fields, handleSubmit, isSubmitted } = form;

  const setIsSubmitted = (isSubmitted: boolean) => setForm((f) => ({ ...f, isSubmitted }));

  const mutateFields = (f: (old: UFields) => UFields) =>
    setForm((form) => {
      if (!form.isSubmitted) return { ...form, fields: f(form.fields) };
      return { ...form, isSubmitted: false, fields: _hideAnswers(f(form.fields)) };
    });
  const setFields = (fields: UFields) => setForm((f) => ({ ...f, fields }));

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

  const submit = () => {
    if (isSubmitted) return;

    const validatedFields = _validate(fields);
    if (!_isValid(validatedFields)) return setFields(validatedFields);

    const checkedFields = _check(validatedFields);
    setFields(checkedFields);
    handleSubmit(_estimations(checkedFields));
    setIsSubmitted(true);
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
    isSubmitted,
  };
};
