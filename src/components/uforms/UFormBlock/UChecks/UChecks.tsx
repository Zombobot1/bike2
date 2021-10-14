import { useEffect, useState } from 'react'
import { UFormFieldData, Validity } from '../../types'
import { fn } from '../../../../utils/types'
import _ from 'lodash'
import { InteractiveQuestion } from '../interactive-question'
import { RadioGroup, Checkbox, FormControlLabel, Radio } from '@mui/material'
import { ErrorText, SuccessText } from '../feedback'
import { shuffle } from '../../../../utils/algorithms'
import { useValidationColor } from '../useValidationColor'

export interface UChecks extends UFormFieldData {
  selectMultiple?: boolean
  submitOnSelect?: boolean
  shuffleOptions?: boolean
}

export const UChecks = ({
  _id,
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
  const [overallValidity, setOverallValidity] = useState<Validity>('NONE')
  const [options, setOptions] = useState(question.options) // use state to shuffle only once

  function onOptionClick(clickedOption: string) {
    if (answer.includes(clickedOption)) onAnswerChange(answer.filter((v) => v !== clickedOption))
    else if (!selectMultiple) onAnswerChange([clickedOption])
    else onAnswerChange([...answer, clickedOption])
  }

  useEffect(() => {
    if (!wasSubmitted) return
    const invalidOption = question.options.find((o) => optionValidity(o, answer, question.correctAnswer) === 'INVALID')
    setOverallValidity(invalidOption ? 'INVALID' : 'VALID')
  }, [wasSubmitted])

  useEffect(() => {
    if (shuffleOptions) setOptions(shuffle(question.options))
    else setOptions(question.options)
  }, [question.options])

  useEffect(() => {
    if (answer[0] && submitOnSelect) onAnswer()
  }, [answer])

  return (
    <div>
      <InteractiveQuestion question={question.question} status={overallValidity} />
      <RadioGroup name={_id}>
        {options.map((o, i) => {
          let validity: Validity = 'NONE'
          if (validationError) validity = 'INVALID'
          else if (wasSubmitted) validity = optionValidity(o, answer, question.correctAnswer)
          return (
            <UChecksOption
              selectMultiple={selectMultiple}
              key={i}
              _id={_id}
              label={o}
              validity={validity}
              onChange={onOptionClick}
              checked={answer.includes(o)}
              readonly={wasSubmitted}
            />
          )
        })}
      </RadioGroup>
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {wasSubmitted && _.difference(answer, question.correctAnswer).length !== 0 && (
        <ErrorText>{question.explanation}</ErrorText>
      )}
      {wasSubmitted && !_.difference(answer, question.correctAnswer).length && (
        <SuccessText>{question.explanation}</SuccessText>
      )}
    </div>
  )
}

function optionValidity(option: string, value: string[], correctAnswer: string[]): Validity {
  if (correctAnswer.includes(option)) return 'VALID'
  else if (value.includes(option) && !correctAnswer.includes(option)) return 'INVALID'
  return 'NONE'
}

interface UChecksOption_ {
  selectMultiple: boolean
  _id: string
  label: string
  onChange: (v: string) => void
  checked: boolean
  validity: Validity
  readonly: boolean
}

function UChecksOption({ selectMultiple, _id, label, validity, onChange, checked, readonly }: UChecksOption_) {
  const color = useValidationColor(validity)

  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiFormControlLabel-label.Mui-disabled': { color },
          '& .PrivateSwitchBase-root': {
            color: `${color} !important`,
            '&.Mui-checked': { color },
          },
        }

  return (
    <FormControlLabel
      value={label}
      control={
        selectMultiple ? (
          <Checkbox inputProps={{ 'aria-label': 'option tick' }} />
        ) : (
          <Radio inputProps={{ 'aria-label': 'option tick' }} />
        )
      }
      label={label}
      sx={sx}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
  )
}
