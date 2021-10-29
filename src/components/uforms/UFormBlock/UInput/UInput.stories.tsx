import { useState } from 'react'
import { Question } from '../../../studying/training/types'
import { UInput } from './UInput'

interface T {
  question: Question
  value: string
  autoFocus: boolean
  wasSubmitted: boolean
  validationError: string
  showTipOnMobile?: boolean
  multiline: boolean
}

const T = (props: T) => () => {
  const [value_, setValue] = useState([props.value])
  return (
    <div style={{ width: '50%' }}>
      <UInput answer={value_} onAnswerChange={setValue} {...props} />
    </div>
  )
}

const defaultI: T = {
  multiline: false,
  question: {
    question: 'Enter abc',
    correctAnswer: ['abc'],
    explanation: 'abc',
    options: [],
  },
  value: '',
  autoFocus: false,
  wasSubmitted: false,
  validationError: '',
}

const rightI: T = {
  ...defaultI,
  value: 'abc',
  wasSubmitted: true,
}

const wrongI: T = {
  ...defaultI,
  value: 'ab',
  wasSubmitted: true,
}

const invalidI: T = {
  ...defaultI,
  validationError: 'Required field',
  wasSubmitted: false,
}

const text: T = {
  ...defaultI,
  value: '',
  multiline: true,
}

export const ShortText = T(defaultI)
export const Text = T(text)
export const Right = T(rightI)
export const Wrong = T(wrongI)
export const Invalid = T(invalidI)

export default {
  title: 'UForms/UInput',
}
