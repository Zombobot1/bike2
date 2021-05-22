import { JSObjectStr } from '../../../utils/types';
import { useMount } from '../../../utils/hooks-utils';
import { atom, useRecoilState } from 'recoil';

export interface UFieldInfo {
  value: string;
  validationError: string;
  correctAnswer: string;
  feedback: string;
}

export interface UField extends UFieldInfo {
  name: string;
  validator: (value: string) => string;
}

export type UFields = UField[];
export type Estimation = { name: string; correctAnswer: string; feedback: string };

export type Estimations = Estimation[];
export type EstimationsP = Promise<Estimations>;
type OnSubmit = (data: JSObjectStr) => EstimationsP;

const onSubmitDefault = async (_: JSObjectStr): EstimationsP => Promise.resolve([]);

const _required = (value: string): string => (value ? '' : 'This is a required field!');

const _applyServerValidation = (fields: UFields, estimations: Estimations): UFields =>
  estimations.map(
    ({ name, correctAnswer, feedback }, i): UField => ({
      name,
      feedback,
      correctAnswer,
      validationError: '',
      value: fields[i].value,
      validator: _required,
    }),
  );

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.value) }));

const _data = (fields: UFields): JSObjectStr => {
  const result: JSObjectStr = {};
  fields.forEach((f) => {
    result[f.name] = f.value;
  });
  return result;
};

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError);

class UFormState {
  fields: UFields = [];
  handleSubmit = onSubmitDefault;
}

export const uformState = atom({
  key: 'uform',
  default: new UFormState(),
});

// const charCountState = selector({
//   key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => {
//     const text = get(uformState);
//     console.log(text.fields);
//     return text.fields;
//   },
// });

export const useUForm = (onSubmit?: OnSubmit) => {
  const [form, setForm] = useRecoilState(uformState);
  const mutateFields = (f: (old: UFields) => UFields) =>
    setForm((form) => {
      // console.log('mutateFields ', 'old', form.fields, 'new', f(form.fields));
      return { ...form, fields: f(form.fields) };
    });
  const setFields = (fields: UFields) => setForm((f) => ({ ...f, fields }));
  const { fields, handleSubmit } = form;

  const addField = (name: string) => {
    console.log('addField', fields.length);
    mutateFields((old) => [
      ...old,
      { name, value: '', validator: _required, validationError: '', feedback: '', correctAnswer: '' },
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
    if (!result) return { validationError: '', feedback: '', value: '', correctAnswer: '' };
    return result;
  };

  const submit = async () => {
    const validatedFields = _validate(fields);
    if (!_isValid(validatedFields)) {
      console.log('invalid', validatedFields);
      return setFields(validatedFields);
    }

    const feedBack = await handleSubmit(_data(fields));
    if (feedBack.length) setFields(_applyServerValidation(fields, feedBack));
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
