import { useState, KeyboardEvent } from 'react'
import { UFormFieldData, Validity } from '../../types'
import { fn } from '../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { ErrorText, SuccessText } from '../feedback'
import { TextField } from '@mui/material'
import { useValidationColor } from '../useValidationColor'

export interface UInput extends UFormFieldData {
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
  showTipOnMobile = true,
  autoFocus = true,
  multiline,
}: UInput) => {
  const [type, setType] = useState(showTipOnMobile ? 'text' : 'password')

  let validity: Validity = 'NONE'
  if (validationError) validity = 'INVALID'
  else if (wasSubmitted && answer[0] !== question.correctAnswer[0]) validity = 'INVALID'
  else if (wasSubmitted && answer[0] === question.correctAnswer[0]) validity = 'VALID'

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
    if (e.key === 'Enter') onAnswer()
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
        value={answer[0]}
        onChange={(e) => {
          setType('text') // anomaly: if it is put onMount or onFocus it breaks slide animation
          onAnswerChange([e.target.value])
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
