import { useState, KeyboardEvent } from 'react'
import { QuestionWithoutOptions, UInputFieldData, Validity } from '../types'
import { Fn, fn } from '../../../utils/types'
import { InteractiveQuestion } from './interactive-question'
import { ErrorText, SuccessText } from './feedback'
import { TextField } from '@material-ui/core'
import { useValidationColor } from './useValidationColor'

export interface UInput extends UInputFieldData {
  showTipOnMobile?: boolean
  autoFocus?: boolean
  multiline?: boolean
}

export const UInput = ({
  _id,
  answer,
  onAnswerChange,
  onAnswer = fn,
  validationError,
  question,
  wasSubmitted,
  showTipOnMobile,
  autoFocus = true,
  multiline,
}: UInput) => {
  return (
    <UInputElement
      _id={_id}
      validationError={validationError}
      value={answer[0]}
      question={question}
      onChange={(s) => onAnswerChange([s])}
      wasSubmitted={wasSubmitted}
      showTipOnMobile={showTipOnMobile}
      onEnter={onAnswer}
      autoFocus={autoFocus}
      multiline={multiline}
    />
  )
}

export interface UInputElementP {
  _id: string
  value: string
  question: QuestionWithoutOptions
  onChange: (v: string) => void
  validationError: string
  wasSubmitted: boolean
  onEnter?: Fn
  showTipOnMobile?: boolean
  autoFocus?: boolean
  multiline?: boolean
}

export const UInputElement = ({
  _id,
  value,
  question,
  onChange,
  wasSubmitted,
  showTipOnMobile = false,
  onEnter = fn,
  autoFocus = true,
  validationError,
  multiline = false,
}: UInputElementP) => {
  const [type, setType] = useState(showTipOnMobile ? 'text' : 'password')

  let validity: Validity = 'NONE'
  if (validationError) validity = 'INVALID'
  else if (wasSubmitted && value !== question.correctAnswer[0]) validity = 'INVALID'
  else if (wasSubmitted && value === question.correctAnswer[0]) validity = 'VALID'

  const color = useValidationColor(validity)
  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: `${color} !important` },
          '& .MuiInputBase-input.Mui-disabled': {
            color,
            WebkitTextFillColor: 'unset',
          },
        }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') onEnter()
  }

  const explanation = validationError ? validationError : question.explanation

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InteractiveQuestion question={question.question} status={validity} />
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Your answer"
        type={type}
        id={_id}
        value={value}
        onChange={(e) => {
          setType('text') // anomaly: if it is put onMount or onFocus it breaks slide animation
          onChange(e.target.value)
        }}
        disabled={wasSubmitted}
        onKeyPress={handleKeyDown}
        autoFocus={autoFocus}
        autoComplete="one-time-code"
        multiline={multiline}
        minRows={2}
        sx={sx}
      />
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {!validationError && validity === 'INVALID' && <ErrorText>{explanation}</ErrorText>}
      {validity === 'VALID' && <SuccessText>{explanation}</SuccessText>}
    </form>
  )
}
