import { useState } from 'react'
import { UInputElement } from './uinput'

interface TUInputP {
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

const TUInput = ({
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
}: TUInputP) => {
  const [value_, setValue] = useState(value)
  return (
    <div style={{ width: '50%' }}>
      <UInputElement
        _id={_id}
        value={value_}
        onChange={setValue}
        question={{ question, correctAnswer: [correctAnswer], explanation }}
        wasSubmitted={wasSubmitted}
        autoFocus={autoFocus}
        validationError={validationError}
        showTipOnMobile={showTipOnMobile}
        multiline={multiline}
      />
    </div>
  )
}

const defaultI: TUInputP = {
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

const rightI: TUInputP = {
  ...defaultI,
  value: 'abc',
  wasSubmitted: true,
}

const wrongI: TUInputP = {
  ...defaultI,
  value: 'ab',
  wasSubmitted: true,
}

const invalidI: TUInputP = {
  ...defaultI,
  validationError: 'Required field',
  wasSubmitted: false,
}

const text: TUInputP = {
  ...defaultI,
  value: '',
  multiline: true,
}

export const ShortText = () => <TUInput {...defaultI} />
export const Text = () => <TUInput {...text} />
export const Right = () => <TUInput {...rightI} />
export const Wrong = () => <TUInput {...wrongI} />
export const Invalid = () => <TUInput {...invalidI} />
