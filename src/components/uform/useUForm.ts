import { atom, useAtom } from 'jotai'
import { CardEstimation, Question } from '../study/training/types'
import { useCallback } from 'react'
import { useMount } from '../../utils/hooks-utils'

export interface UFieldInfo {
  answer: string[]
  question: Question
  validationError: string
  wasSubmitted: boolean
}

export interface UField extends UFieldInfo {
  _id: string
  validator: (value: string[]) => string
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

const QUESTION = {
  correctAnswer: [],
  question: '',
  explanation: '',
  options: [],
}

const INFO = {
  question: QUESTION,
  answer: [''],
  validationError: '',
  wasSubmitted: false,
}

const FIELD: UField = {
  ...INFO,
  _id: '',
  validator: _required,
}

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.answer) }))

const _check = (fields: UFields): UFields =>
  fields.map(
    (f): UField => ({
      ...f,
      estimation: f.answer[0] === f.question.correctAnswer[0] ? 'GOOD' : 'BAD',
      wasSubmitted: true,
    }),
  )

const _estimations = (fields: UFields): Estimations => {
  return fields.map(({ _id, answer: value, estimation }) => ({ _id, value, estimation: estimation || 'BAD' }))
}

const _isValid = (fields: UFields): boolean => !fields.find((f) => f.validationError)

const fieldsAtom = atom<UFields>([])

export const useUFormField = (_id: string, question: Question = QUESTION, initialAnswer = ['']) => {
  const [fields, setFields] = useAtom(fieldsAtom)

  const addField = () => {
    setFields((old) => [...old, { ...FIELD, _id: _id, question: question, answer: initialAnswer }])
  }

  const removeField = () => {
    setFields((old) => old.filter((f) => f._id !== _id))
  }

  const onAnswerChange = (value: string[]) => {
    setFields((old) =>
      old.map((f) => (f._id === _id ? { ...f, answer: value, validationError: f.validator(value) } : f)),
    )
  }

  const info: UFieldInfo = fields.find((f) => f._id === _id) || INFO

  useMount(() => {
    addField()
    return () => removeField()
  })

  return {
    ...info,
    onAnswerChange,
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
