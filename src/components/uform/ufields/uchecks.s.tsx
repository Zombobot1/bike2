import { QuestionP, UChecksElement } from './uchecks'
import { useState } from 'react'

interface TUChecksP extends QuestionP {
  _id: string
  wasSubmitted: boolean
  value: string[]
  validationError: string
  selectMultiple: boolean
}

const TUChecks = ({
  _id,
  question,
  options,
  correctAnswer,
  explanation,
  value,
  wasSubmitted,
  validationError,
  selectMultiple,
}: TUChecksP) => {
  const [value_, setValue] = useState(value)
  return (
    <div style={{ width: '50%' }}>
      <UChecksElement
        _id={_id}
        value={value_}
        onChange={(_, v) => setValue(v)}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
        options={options}
        question={question}
        correctAnswer={correctAnswer}
        explanation={explanation}
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

const radioData: TUChecksP = {
  _id: 'radioData',
  question: 'Please select',
  options: selectOneOptions,
  correctAnswer: selectOneCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: false,
}

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong']
const selectMultipleCorrectAnswer = ['Right', 'Also right']

const checksData: TUChecksP = {
  _id: 'checksData',
  question: 'Please select',
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
  validationError: '',
  wasSubmitted: false,
  value: [''],
  selectMultiple: true,
}

const selectOne: TUChecksP = {
  ...radioData,
}

const selectMany: TUChecksP = {
  ...checksData,
}

const right: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 1'],
}
const wrong: TUChecksP = {
  ...radioData,
  wasSubmitted: true,
  value: ['Option 2'],
}
const invalid: TUChecksP = {
  ...radioData,
  validationError: 'Required field',
}

const wrongMultiple: TUChecksP = {
  ...radioData,
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  wasSubmitted: true,
  value: ['Right', 'Also wrong', 'Wrong'],
  selectMultiple: true,
}

export const SelectOne = () => <TUChecks {...selectOne} />
export const SelectMany = () => <TUChecks {...selectMany} />
export const Right = () => <TUChecks {...right} />
export const Wrong = () => <TUChecks {...wrong} />
export const WrongMultiple = () => <TUChecks {...wrongMultiple} />
export const Invalid = () => <TUChecks {...invalid} />
