import { atom, useAtom } from 'jotai'
import { CardEstimation, Question } from '../studying/training/types'
import { useCallback, useEffect, useState } from 'react'
import { bool, num, SetStr, str, strs } from '../../utils/types'
import { UFormBlockComponent } from '../editing/types'
import { cast } from '../../utils/utils'
import _ from 'lodash'
import { avg } from '../../utils/algorithms'
import { useReactive } from '../utils/hooks/hooks'

export interface UFieldInfo {
  answer: string[]
  question: Question
  validationError: string
  wasSubmitted: boolean
}

export interface UField extends UFieldInfo {
  _id: string
  validator: (value: string[]) => string
  estimation?: num
  isTextArea?: bool
}
export type UFields = UField[]

type OnSubmit = (estimation: num) => void

const _required = (value: string[]): string => (value[0] ? '' : 'Answer required!')

const QUESTION = {
  correctAnswer: [],
  question: '',
  explanation: '',
  options: [],
}

function getQuestion(t: UFormBlockComponent): Question {
  const checks: UFormBlockComponent[] = ['checks', 'radio']
  return checks.includes(t) ? { ...QUESTION, options: ['Option'] } : QUESTION
}

const INFO = {
  question: QUESTION,
  answer: [],
  validationError: '',
  wasSubmitted: false,
}

const FIELD: UField = {
  ...INFO,
  _id: '',
  validator: _required,
}

const _validate = (fields: UFields): UFields => fields.map((f) => ({ ...f, validationError: f.validator(f.answer) }))
const _validateNew = (fields: UFields): UFields =>
  fields.map((f) => ({ ...f, validationError: _isCorrectAnswerProvided(f) ? '' : 'Select correct answer!' }))

const _missingCorrectAnswer = (fields: UFields) => fields.find((f) => !_isCorrectAnswerProvided(f))
const _isCorrectAnswerProvided = (f: UField) => f.isTextArea || !!f.question.correctAnswer[0]?.length

const _check = (fields: UFields): UFields =>
  fields.map(
    (f): UField => ({
      ...f,
      estimation: isAnswerCorrect(f.answer, f.question.correctAnswer) ? 1 : 0,
      wasSubmitted: true,
    }),
  )

const _estimation = (fields: UFields): num => Math.round(avg(fields, (p, f) => p + (f.estimation || 0)) * 100)

const _isValid = (fields: UFields): boolean => !!fields.length && !fields.find((f) => f.validationError)

const fieldsAtom = atom<UFields>([])

export function isAnswerCorrect(answer: strs, correctAnswer: strs) {
  return !_.difference(
    correctAnswer.map((a) => a.toLowerCase()),
    answer.map((a) => a.toLowerCase()),
  ).length
}

export const useUFormBlock = (_id: str, data: str) => {
  const [question] = useState(() => cast(data, QUESTION)) // parse once
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

type O = { isTextArea?: bool }
export const useUFormBlockEditor = (_id: str, type: UFormBlockComponent, data: str, setData: SetStr, options?: O) => {
  const [initialQuestion] = useState(() => cast(data, getQuestion(type))) // parse once
  const setQuestion = (q: Question) => setData(JSON.stringify(q))

  useField(_id, initialQuestion, options)
  const [fields, setFields] = useAtom(fieldsAtom)

  const onQuestionChange = (question: Question) => {
    setFields((old) =>
      old.map((f) =>
        f._id === _id ? { ...f, question, validationError: question.correctAnswer.length ? '' : f.validationError } : f,
      ),
    )
    setQuestion(question)
  }

  const field = fields.find((f) => f._id === _id)
  return {
    question: field?.question || initialQuestion,
    onQuestionChange,
    validationError: field?.validationError || '',
  }
}

export const useUForm = (isEditing = false) => {
  const [fields, setFields] = useAtom(fieldsAtom)
  const [needValidityCheck, setNeedValidityCheck] = useState(!isEditing)
  const [error] = useReactive(needValidityCheck ? fieldsValidity(fields, isEditing) : '')

  const _submit = (handleSubmit: OnSubmit) => {
    const validatedFields = _validate(fields)
    if (!_isValid(validatedFields)) return setFields(validatedFields)

    const checkedFields = _check(validatedFields)
    setFields(checkedFields)
    handleSubmit(_estimation(checkedFields))
  }

  const __validateNew = () => {
    const validatedFields = _validateNew(fields)
    if (!validatedFields.length) return 'Add questions!'
    if (!_isValid(validatedFields)) {
      setFields(validatedFields)
      setNeedValidityCheck(true)
      return 'Select correct answer!'
    }

    return ''
  }

  const submit = useCallback(_submit, [fields])
  const validateNew = useCallback(__validateNew, [fields])

  const retry = () =>
    setFields((old) =>
      old.map(
        (f): UField => ({
          _id: f._id,
          question: f.question,
          validationError: '',
          validator: _required,
          answer: [],
          wasSubmitted: false,
        }),
      ),
    )

  return {
    submit,
    wasSubmitted: !!fields.find((f) => f.wasSubmitted),
    retry,
    validateNew,
    error,
  }
}

function useField(_id: str, question: Question, options?: O) {
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

  useEffect(() => {
    setFields((old) => old.map((f) => (f._id === _id ? { ...f, isTextArea: options?.isTextArea } : f)))
  }, [options?.isTextArea])
}

function fieldsValidity(fields: UFields, isEditing: bool): str {
  if (!fields.length) return isEditing ? 'Add question!' : 'Missing questions!'
  if (_missingCorrectAnswer(fields)) return isEditing ? 'Add correct answer!' : 'Missing correct answer!'
  return ''
}
