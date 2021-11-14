import { UFormFieldData } from '../../types'
import { fn } from '../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { Feedback } from '../Feedback'
import { isUInputValid, UInputField } from './UInputField'

export interface UInput extends UFormFieldData {
  showTipOnMobile?: boolean
  autoFocus?: boolean
  multiline?: boolean
}

export const UInput = ({
  answer,
  onAnswerChange,
  onAnswer = fn,
  validationError,
  question,
  wasSubmitted,
  showTipOnMobile = true,
  autoFocus = false,
  multiline = false,
}: UInput) => {
  const validity = isUInputValid(answer, question.correctAnswer, validationError, wasSubmitted)
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InteractiveQuestion question={question.question} />
      <UInputField
        answer={answer}
        autoFocus={autoFocus}
        multiline={multiline}
        onAnswer={onAnswer}
        onAnswerChange={onAnswerChange}
        showTipOnMobile={showTipOnMobile}
        validity={validity}
        wasSubmitted={wasSubmitted}
      />
      <Feedback
        validity={validity}
        explanation={question.explanation || question.correctAnswer[0]}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
      />
    </form>
  )
}
