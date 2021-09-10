import { useState } from 'react'
import { UInput } from './UInput'

interface T {
  _id: string
  question: string
  explanation: string
  value: string
  autoFocus: boolean
  wasSubmitted: boolean
  correctAnswer: string
  validationError: string
  showTipOnMobile?: boolean
  multiline: boolean
}

const T = ({
  _id,
  question,
  correctAnswer,
  explanation,
  value,
  wasSubmitted,
  validationError,
  autoFocus,
  showTipOnMobile,
  multiline,
}: T) => {
  const [value_, setValue] = useState([value])
  return (
    <div style={{ width: '50%' }}>
      <UInput
        _id={_id}
        answer={value_}
        onAnswerChange={setValue}
        question={{ question, correctAnswer: [correctAnswer], explanation, options: [] }}
        wasSubmitted={wasSubmitted}
        autoFocus={autoFocus}
        validationError={validationError}
        showTipOnMobile={showTipOnMobile}
        multiline={multiline}
      />
    </div>
  )
}

const defaultI: T = {
  _id: 'defaultI',
  multiline: false,
  question: 'Enter abc',
  value: '',
  autoFocus: false,
  wasSubmitted: false,
  correctAnswer: 'abc',
  explanation: 'abc',
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

export const ShortText = () => <T {...defaultI} />
export const Text = () => <T {...text} />
export const Right = () => <T {...rightI} />
export const Wrong = () => <T {...wrongI} />
export const Invalid = () => <T {...invalidI} />

export default {
  title: 'UForms/UInput',
}
