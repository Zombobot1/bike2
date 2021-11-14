import { UFormFieldData } from '../../types'
import { fn } from '../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { RadioGroup } from '@mui/material'
import { Feedback } from '../Feedback'
import { UChecksOptions, useUChecksOptions } from './UChecksOptions'

export interface UChecks extends UFormFieldData {
  selectMultiple?: boolean
  submitOnSelect?: boolean
  shuffleOptions?: boolean
}

export const UChecks = ({
  answer,
  onAnswerChange,
  onAnswer = fn,
  validationError,
  question,
  wasSubmitted,
  selectMultiple = false,
  submitOnSelect = true,
  shuffleOptions = false,
}: UChecks) => {
  const { onOptionClick, options, overallValidity } = useUChecksOptions(
    question,
    answer,
    onAnswerChange,
    onAnswer,
    shuffleOptions,
    selectMultiple,
    submitOnSelect,
  )
  return (
    <div>
      <InteractiveQuestion question={question.question} />
      <RadioGroup>
        <UChecksOptions
          answer={answer}
          correctAnswer={question.correctAnswer}
          onOptionClick={onOptionClick}
          options={options}
          selectMultiple={selectMultiple}
          validationError={validationError}
          wasSubmitted={wasSubmitted}
        />
      </RadioGroup>
      <Feedback
        validity={overallValidity}
        explanation={question.explanation}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
      />
    </div>
  )
}
