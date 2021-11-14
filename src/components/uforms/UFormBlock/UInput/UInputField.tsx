import { useState, KeyboardEvent } from 'react'
import { bool, Fn, str, strs } from '../../../../utils/types'
import { TextInput } from '../../../utils/MuiUtils'
import { Validity } from '../../types'
import { isAnswerCorrect } from '../../useUForm'
import { useValidationColor } from '../useValidationColor'

export interface UInputField {
  showTipOnMobile: bool
  answer: strs
  onAnswerChange: (s: strs) => void
  onAnswer: Fn
  validity: Validity
  wasSubmitted: bool
  autoFocus: bool
  multiline: bool
}

export function UInputField({
  answer,
  onAnswer,
  onAnswerChange,
  showTipOnMobile,
  validity,
  autoFocus,
  multiline,
  wasSubmitted,
}: UInputField) {
  const [type, setType] = useState(showTipOnMobile ? 'text' : 'password')

  const color = useValidationColor(validity)
  const sx =
    validity === 'none'
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

  return (
    <TextInput
      fullWidth
      variant="outlined"
      placeholder="Your answer"
      type={type}
      value={answer[0] || ''}
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
      inputProps={{ 'data-cy': 'answer' }}
    />
  )
}

export function isUInputValid(answer: strs, correctAnswer: strs, validationError: str, wasSubmitted: bool): Validity {
  if (validationError) return 'invalid'
  else if (wasSubmitted) return isAnswerCorrect(answer, correctAnswer) ? 'valid' : 'invalid'
  return 'none'
}
