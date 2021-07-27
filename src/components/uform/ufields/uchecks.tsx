import { useUForm } from '../uform'
import { useMount } from '../../../utils/hooks-utils'
import { useEffect, useState } from 'react'
import { Validity } from '../types'
import { Question } from '../../study/training/types'
import { fn, Fn } from '../../../utils/types'
import _ from 'lodash'
import { InteractiveQuestion } from './interactive-question'
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { ErrorText, SuccessText } from './feedback'
import { useValidationColor } from './useValidationColor'
import { shuffle } from '../../../utils/algorithms'

export interface USelectInputP {
  selectMultiple: boolean
  _id: string
  label: string
  onChange: (v: string) => void
  checked: boolean
  validity: Validity
  readonly: boolean
}

export const USelectInput = ({ selectMultiple, _id, label, validity, onChange, checked, readonly }: USelectInputP) => {
  const color = useValidationColor(validity)

  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiFormControlLabel-label.Mui-disabled': { color },
          '& .PrivateSwitchBase-root': {
            color: `${color} !important`, // the order of application of css classes for radio and checks is different -> used important to override
            '&.Mui-checked': { color },
          },
        }

  return (
    <FormControlLabel
      value={label}
      control={selectMultiple ? <Checkbox /> : <Radio />}
      label={label}
      sx={sx}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
  )
}

export type QuestionWithoutOptions = Omit<Question, 'options'>

function optionValidity(option: string, value: string[], correctAnswer: string[]): Validity {
  if (correctAnswer.includes(option)) return 'VALID'
  else if (value.includes(option) && !correctAnswer.includes(option)) return 'INVALID'
  return 'NONE'
}

export interface UChecksElementP {
  _id: string
  question: Question
  value: string[]
  onChange: (radioName: string, value: string[]) => void
  validationError: string
  wasSubmitted: boolean
  selectMultiple?: boolean
  shuffleOptions?: boolean
}

export const UChecksElement = ({
  onChange,
  _id,
  question,
  validationError,
  value,
  wasSubmitted,
  selectMultiple = false,
  shuffleOptions = false,
}: UChecksElementP) => {
  const [overallValidity, setOverallValidity] = useState<Validity>('NONE')
  const [options, setOptions] = useState(question.options) // use state to shuffle only once

  function onOptionClick(clickedOption: string) {
    if (value.includes(clickedOption))
      onChange(
        _id,
        value.filter((v) => v !== clickedOption),
      )
    else if (!selectMultiple) onChange(_id, [clickedOption])
    else onChange(_id, [...value, clickedOption])
  }

  useEffect(() => {
    if (!wasSubmitted) return
    const invalidOption = question.options.find((o) => optionValidity(o, value, question.correctAnswer) === 'INVALID')
    setOverallValidity(invalidOption ? 'INVALID' : 'VALID')
  }, [wasSubmitted])

  useMount(() => {
    if (shuffleOptions) setOptions(shuffle(question.options))
  })

  return (
    <div>
      <InteractiveQuestion question={question.question} status={overallValidity} />
      <RadioGroup name={_id}>
        {options.map((o, i) => {
          let validity: Validity = 'NONE'
          if (validationError) validity = 'INVALID'
          else if (wasSubmitted) validity = optionValidity(o, value, question.correctAnswer)
          return (
            <USelectInput
              selectMultiple={selectMultiple}
              key={i}
              _id={_id}
              label={o}
              validity={validity}
              onChange={onOptionClick}
              checked={value.includes(o)}
              readonly={wasSubmitted}
            />
          )
        })}
      </RadioGroup>
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {wasSubmitted && _.difference(value, question.correctAnswer).length !== 0 && (
        <ErrorText>{question.explanation}</ErrorText>
      )}
      {wasSubmitted && !_.difference(value, question.correctAnswer).length && (
        <SuccessText>{question.explanation}</SuccessText>
      )}
    </div>
  )
}

export interface UChecksP {
  _id: string
  question?: Question
  onAnswer?: Fn
  initialAnswer?: string[]
  selectMultiple?: boolean
  submitOnSelect?: boolean
  shuffleOptions?: boolean
}

export const UChecks = ({
  _id,
  question,
  initialAnswer,
  selectMultiple = false,
  onAnswer = fn,
  submitOnSelect = true,
  shuffleOptions = false,
}: UChecksP) => {
  const question_ = handleEmptyQuestion(question)

  const { addField, getFieldInfo, removeField, onChange } = useUForm()
  const { validationError, value, wasSubmitted } = getFieldInfo(_id)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    if (value[0] && submitOnSelect) setCanSubmit(true)
  }, [value])

  useEffect(() => {
    if (canSubmit) {
      onAnswer()
      setCanSubmit(false)
    }
  }, [canSubmit])

  useMount(() => {
    addField(_id, question_.correctAnswer, initialAnswer)
    return () => removeField(_id)
  })

  return (
    <UChecksElement
      _id={_id}
      onChange={onChange}
      value={value}
      question={question_}
      validationError={validationError}
      wasSubmitted={wasSubmitted}
      selectMultiple={selectMultiple}
      shuffleOptions={shuffleOptions}
    />
  )
}

function handleEmptyQuestion(q?: Question): Question {
  if (q) return q
  return { correctAnswer: [], explanation: '', options: [], question: '' }
}
