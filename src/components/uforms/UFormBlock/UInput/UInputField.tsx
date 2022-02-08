import { useState } from 'react'
import { bool, f, JSObject, num, SetStr, str } from '../../../../utils/types'
import { useReactive } from '../../../utils/hooks/hooks'
import { TextInput } from '../../../utils/MuiUtils'
import { Correctness } from '../../types'
import { FeedbackIndex } from '../Feedback'
import { useValidationColor } from '../useValidationColor'

export interface UInputField {
  answer: str
  setAnswer: SetStr
  correctAnswer: str
  validationError: str
  wasSubmitted: bool
  onChange?: SetStr
  multiline?: bool
  autoFocus?: bool
  hideTipOnMobile?: bool
  inline?: bool
  i?: num
}

export function UInputField({
  answer: initialAnswer,
  setAnswer: setOuterAnswer,
  correctAnswer,
  hideTipOnMobile,
  autoFocus,
  validationError,
  multiline,
  wasSubmitted,
  onChange = f,
  inline,
  i,
}: UInputField) {
  const [answer, setAnswer] = useReactive(initialAnswer)
  const [type, setType] = useState(hideTipOnMobile ? 'password' : 'text')

  let correctness: Correctness = 'none'
  const ignoreValidationError = inline && answer.length
  if (validationError && !ignoreValidationError) correctness = 'incorrect'
  else if (wasSubmitted) correctness = correctAnswer.toLowerCase() === answer.toLowerCase() ? 'correct' : 'incorrect'
  if (wasSubmitted && multiline) correctness = 'none'

  const color = useValidationColor(correctness)

  let sx: JSObject =
    correctness === 'none'
      ? {}
      : {
          '.MuiOutlinedInput-notchedOutline': { borderColor: `${color} !important` },
          '.MuiInput-underline::before': { borderColor: `${color}`, borderBottomStyle: 'dotted' },
          '.MuiInputBase-input.Mui-disabled': {
            color,
            WebkitTextFillColor: 'unset',
          },
        }

  if (inline)
    sx = {
      ...sx,
      maxWidth: Math.max(answer.length * 1.2, 5) + 'ch',
      paddingLeft: '0.2rem',
      paddingRight: '0.1rem',
      input: {
        padding: 0,
      },
    }

  return (
    <>
      {inline && <FeedbackIndex i={i} validity={correctness} wasSubmitted={wasSubmitted} space={true} />}
      <TextInput
        size="small"
        fullWidth={!inline}
        variant={inline ? 'standard' : 'outlined'}
        placeholder={inline ? '' : 'Your answer'}
        type={type}
        value={answer}
        onChange={(e) => {
          setType('text') // anomaly: if it is put onMount or onFocus it breaks slide animation
          setAnswer(e.target.value)
          onChange(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !multiline) setOuterAnswer(answer)
        }}
        onBlur={() => {
          if (answer !== initialAnswer) setOuterAnswer(answer)
        }}
        disabled={wasSubmitted}
        autoFocus={autoFocus}
        autoComplete="off" // https://stackoverflow.com/questions/15738259/disabling-chrome-autofill
        multiline={multiline}
        minRows={2}
        sx={sx}
        inputProps={{ 'data-cy': 'answer' }}
      />
    </>
  )
}
