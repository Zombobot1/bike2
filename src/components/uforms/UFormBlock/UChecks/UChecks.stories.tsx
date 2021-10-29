import { UChecks } from './UChecks'
import { useState } from 'react'
import { Question } from '../../../studying/training/types'
import { bool, str, strs } from '../../../../utils/types'

interface T {
  question: Question
  wasSubmitted: bool
  value: strs
  validationError: str
  selectMultiple: bool
}

const T = (props: T) => () => {
  const [value_, setValue] = useState(props.value)
  return (
    <div style={{ width: '500px' }}>
      <UChecks answer={value_} onAnswerChange={setValue} {...props} />
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

export const SelectOne = T(selectOne)
export const SelectMany = T(selectMany)
export const SelectOneRight = T(right)
export const SelectOneWrong = T(wrong)
export const SelectManyWrong = T(wrongMultiple)
export const Invalid = T(invalid)

export default {
  title: 'UForms/UChecks',
}
