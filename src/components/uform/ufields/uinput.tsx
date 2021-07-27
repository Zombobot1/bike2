import { useState, KeyboardEvent } from 'react'
import { useUForm } from '../uform'
import { useMount } from '../../../utils/hooks-utils'
import { Validity } from '../types'
import { QuestionWithoutOptions } from './uchecks'
import { Fn, fn } from '../../../utils/types'
import { InteractiveQuestion } from './interactive-question'
import { ErrorText, SuccessText } from './feedback'
import { TextField } from '@material-ui/core'
import { useValidationColor } from './useValidationColor'

export type TipOnMobile = 'SHOW_TIP' | 'HIDE_TIP'

export interface UInputElementP {
  _id: string
  value: string
  question: string
  onChange: (v: string) => void
  correctAnswer: string
  explanation: string
  validationError: string
  wasSubmitted: boolean
  onEnter?: Fn
  tipOnMobile?: TipOnMobile
  autoFocus?: boolean
}

export const UInputElement = ({
  _id,
  value,
  question,
  correctAnswer,
  explanation,
  onChange,
  wasSubmitted,
  tipOnMobile = 'HIDE_TIP',
  onEnter = fn,
  autoFocus = true,
  validationError,
}: UInputElementP) => {
  const [type, setType] = useState(tipOnMobile === 'HIDE_TIP' ? 'password' : 'text')

  let validity: Validity = 'NONE'
  if (validationError) validity = 'INVALID'
  else if (wasSubmitted && value !== correctAnswer) validity = 'INVALID'
  else if (wasSubmitted && value === correctAnswer) validity = 'VALID'

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

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InteractiveQuestion question={question} status={validity} />
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
        sx={sx}
      />
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {!validationError && validity === 'INVALID' && <ErrorText>{explanation}</ErrorText>}
      {validity === 'VALID' && <SuccessText>{explanation}</SuccessText>}
    </form>
  )
}

export interface UInputP {
  _id: string
  question?: QuestionWithoutOptions
  initialAnswer?: string[]
  tipOnMobile?: TipOnMobile
  onAnswer?: Fn
  autoFocus?: boolean
}

export const UInput = ({
  _id,
  question,
  tipOnMobile = 'HIDE_TIP',
  onAnswer = fn,
  autoFocus = true,
  initialAnswer,
}: UInputP) => {
  const { correctAnswer, explanation, question: question_ } = handleEmptyQuestion(question)
  const { addField, getFieldInfo, removeField, onChange } = useUForm()
  const { value, validationError, wasSubmitted } = getFieldInfo(_id)

  useMount(() => {
    addField(_id, correctAnswer, initialAnswer)
    return () => removeField(_id)
  })

  return (
    <UInputElement
      _id={_id}
      correctAnswer={correctAnswer[0]}
      validationError={validationError}
      value={value[0]}
      question={question_}
      onChange={(s) => onChange(_id, [s])}
      explanation={validationError ? validationError : explanation}
      wasSubmitted={wasSubmitted}
      tipOnMobile={tipOnMobile}
      onEnter={onAnswer}
      autoFocus={autoFocus}
    />
  )
}

function handleEmptyQuestion(q?: QuestionWithoutOptions): QuestionWithoutOptions {
  if (q) return q
  return { correctAnswer: [], explanation: '', question: '' }
}
