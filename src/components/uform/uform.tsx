import { atom, useAtom } from 'jotai'
import { CardEstimation } from '../study/training/types'
import { useCallback } from 'react'

export interface UFieldInfo {
  value: string[]
  validationError: string
  wasSubmitted: boolean
}

export interface UField extends UFieldInfo {
  _id: string
  validator: (value: string[]) => string
  correctAnswer: string[]
  estimation?: CardEstimation
}
export type UFields = UField[]

export interface Estimation {
  _id: string
  value: string[]
  estimation: CardEstimation
}
export type Estimations = Estimation[]

type OnSubmit = (estimations: Estimations) => void

const _required = (value: string[]): string => (value[0] ? '' : 'This is a required field!')

const FIELD: UField = {
  _id: '',
  correctAnswer: [''],
  value: [''],
  validator: _required,
  validationError: '',
  wasSubmitted: false,
}

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.value) }))

const _check = (fields: UFields): UFields =>
  fields.map(
    (f): UField => ({
      ...f,
      estimation: f.value[0] === f.correctAnswer[0] ? 'GOOD' : 'BAD',
      wasSubmitted: true,
    }),
  )

const _estimations = (fields: UFields): Estimations => {
  return fields.map(({ _id, value, estimation }) => ({ _id, value, estimation: estimation || 'BAD' }))
}

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError)

const fieldsAtom = atom<UFields>([])

export const useUForm = () => {
  const [fields, setFields] = useAtom(fieldsAtom)

  const addField = (_id: string, correctAnswer: string[], initialAnswer = ['']) => {
    setFields((old) => [...old, { ...FIELD, _id: _id, correctAnswer, value: initialAnswer }])
  }

  const removeField = (_id: string) => {
    setFields((old) => old.filter((f) => f._id !== _id))
  }

  const onChange = (_id: string, value: string[]) => {
    setFields((old) =>
      old.map((f) => (f._id === _id ? { ...f, value: value, validationError: f.validator(value) } : f)),
    )
  }

  const getFieldInfo = (_id: string): UFieldInfo => {
    const result = fields.find((f) => f._id === _id)
    if (!result) return { ...FIELD }
    return result
  }

  return {
    getFieldInfo,
    addField,
    removeField,
    onChange,
  }
}

export const useUFormSubmit = () => {
  const [fields, setFields] = useAtom(fieldsAtom)

  const _submit = (handleSubmit: OnSubmit) => {
    const validatedFields = _validate(fields)
    if (!_isValid(validatedFields)) return setFields(validatedFields)

    const checkedFields = _check(validatedFields)
    setFields(checkedFields)
    handleSubmit(_estimations(checkedFields))
  }

  const submit = useCallback(_submit, [fields])

  return { submit }
}
