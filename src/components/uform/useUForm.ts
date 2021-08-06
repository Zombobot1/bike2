import { atom, useAtom } from 'jotai'
import { CardEstimation, Question } from '../study/training/types'
import { useCallback, useEffect, useState } from 'react'
import { SetStr, str, strs } from '../../utils/types'
import { UFormComponent } from '../ucomponents/types'

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

function getQuestion(t: UFormComponent): Question {
  const checks: UFormComponent[] = ['CHECKS', 'RADIO']
  return checks.includes(t) ? { ...QUESTION, options: ['Option 1', 'Option 2'] } : QUESTION
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

export const useUFormBlock = (_id: str, data: str) => {
  const [question] = useState(() => parse(data, QUESTION)) // parse once
  useField(_id, question)

  const [fields, setFields] = useAtom(fieldsAtom)

  const onAnswerChange = (value: strs) => {
    setFields((old) =>
      old.map((f) => (f._id === _id ? { ...f, answer: value, validationError: f.validator(value) } : f)),
    )
  }

  const info: UFieldInfo = fields.find((f) => f._id === _id) || INFO

  return {
    ...info,
    onAnswerChange,
  }
}

export const useUFormBlockEditor = (_id: str, type: UFormComponent, data: str, setData: SetStr) => {
  const [initialQuestion] = useState(() => parse(data, getQuestion(type))) // parse once
  const setQuestion = (q: Question) => setData(JSON.stringify(q))

  useField(_id, initialQuestion)
  const [fields, setFields] = useAtom(fieldsAtom)

  const onQuestionChange = (question: Question) => {
    setFields((old) => old.map((f) => (f._id === _id ? { ...f, question } : f)))
    setQuestion(question)
  }

  const question: Question = fields.find((f) => f._id === _id)?.question || initialQuestion

  return {
    question,
    onQuestionChange,
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

function useField(_id: str, question: Question) {
  const [_, setFields] = useAtom(fieldsAtom)

  const addField = () => {
    setFields((old) => [...old, { ...FIELD, _id: _id, question }])
  }

  const removeField = () => {
    setFields((old) => old.filter((f) => f._id !== _id))
  }

  useEffect(() => {
    if (!_id) return
    addField()
    return () => removeField()
  }, [_id])
}

function parse<T>(data: str, default_: T): T {
  if (!data) return default_

  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.error(error)
  }

  return default_
}
