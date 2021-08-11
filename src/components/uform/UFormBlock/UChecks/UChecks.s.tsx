import { UChecks } from './UChecks'
import { useState } from 'react'
import { Question } from '../../../study/training/types'

interface T {
  _id: string
  question: Question
  wasSubmitted: boolean
  value: string[]
  validationError: string
  selectMultiple: boolean
}

const T = ({ _id, question, value, wasSubmitted, validationError, selectMultiple }: T) => {
  const [value_, setValue] = useState(value)
  return (
    <div style={{ width: '50%' }}>
      <UChecks
        _id={_id}
        answer={value_}
        onAnswerChange={setValue}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
        question={question}
        selectMultiple={selectMultiple}
      />
    </div>
  )
}

const selectOneOptions = [
  'Option 1',
  'Option 2',
  'Looooooooooooooooooong text inside this option renders without visual deffects',
]
const selectOneCorrectAnswer = ['Option 1']

const radioData: T = {
  _id: 'radioData',
  question: {
    question: 'Please select',
    options: selectOneOptions,
    correctAnswer: selectOneCorrectAnswer,
    explanation: 'This is a loooooooooooooooooooooong Cuz',
  },
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: false,
}

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong']
const selectMultipleCorrectAnswer = ['Right', 'Also right']

const checksData: T = {
  _id: 'checksData',
  question: {
    question: 'Please select',
    options: selectMultipleOptions,
    correctAnswer: selectMultipleCorrectAnswer,
    explanation: 'This is a loooooooooooooooooooooong Cuz',
  },
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: true,
}

const selectOne: T = {
  ...radioData,
}

const selectMany: T = {
  ...checksData,
}

const right: T = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 1'],
}
const wrong: T = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 2'],
}
const invalid: T = {
  ...radioData,
  validationError: 'Required field',
}

const wrongMultiple: T = {
  ...checksData,
  wasSubmitted: true,
  value: ['Right', 'Also wrong', 'Wrong'],
  selectMultiple: true,
}

export const UChecksS = {
  SelectOne: () => <T {...selectOne} />,
  SelectMany: () => <T {...selectMany} />,
  SelectOneRight: () => <T {...right} />,
  SelectOneWrong: () => <T {...wrong} />,
  SelectManyWrong: () => <T {...wrongMultiple} />,
  Invalid: () => <T {...invalid} />,
}
