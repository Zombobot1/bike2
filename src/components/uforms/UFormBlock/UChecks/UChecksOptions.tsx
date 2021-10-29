import { Checkbox, FormControlLabel, Radio } from '@mui/material'
import _ from 'lodash'
import { shuffle } from 'lodash'
import { useEffect, useState } from 'react'
import { bool, Fn, SetStr, str, strs } from '../../../../utils/types'
import { Question } from '../../../studying/training/types'
import { CTick, RTick } from '../../../utils/MuiUtils'
import { Validity } from '../../types'
import { isAnswerCorrect } from '../../useUForm'
import { useValidationColor } from '../useValidationColor'

export interface UChecksOptions {
  options: strs
  answer: strs
  correctAnswer: strs
  validationError: str
  wasSubmitted: bool
  selectMultiple: bool
  onOptionClick: SetStr
}
export function UChecksOptions({
  answer,
  correctAnswer,
  options,
  selectMultiple,
  validationError,
  wasSubmitted,
  onOptionClick,
}: UChecksOptions) {
  return (
    <>
      {options.map((o, i) => {
        let validity: Validity = 'none'
        if (validationError) validity = 'invalid'
        else if (wasSubmitted) validity = optionValidity(o, answer, correctAnswer)
        return (
          <UChecksOption
            selectMultiple={selectMultiple}
            key={i}
            label={o}
            validity={validity}
            onChange={onOptionClick}
            checked={answer.includes(o)}
            readonly={wasSubmitted}
          />
        )
      })}
    </>
  )
}

export function useUChecksOptions(
  question: Question,
  answer: strs,
  onAnswerChange: (s: strs) => void,
  onAnswer: Fn,
  shuffleOptions: bool,
  selectMultiple: bool,
  submitOnSelect: bool,
) {
  const [options, setOptions] = useState(question.options) // use state to shuffle only once

  function onOptionClick(clickedOption: string) {
    if (answer.includes(clickedOption)) onAnswerChange(answer.filter((v) => v !== clickedOption))
    else if (!selectMultiple) onAnswerChange([clickedOption])
    else onAnswerChange([...answer, clickedOption])
  }

  useEffect(() => {
    if (shuffleOptions) setOptions(shuffle(question.options))
    else setOptions(question.options)
  }, [question.options])

  useEffect(() => {
    if (answer[0] && submitOnSelect) onAnswer()
  }, [answer])

  const overallValidity: Validity = isAnswerCorrect(answer, question.correctAnswer) ? 'valid' : 'invalid'
  return { options, onOptionClick, overallValidity }
}

function optionValidity(option: string, value: string[], correctAnswer: string[]): Validity {
  if (correctAnswer.includes(option)) return 'valid'
  else if (value.includes(option) && !correctAnswer.includes(option)) return 'invalid'
  return 'none'
}

interface UChecksOption_ {
  selectMultiple: boolean
  label: string
  onChange: (v: string) => void
  checked: boolean
  validity: Validity
  readonly: boolean
}

function UChecksOption({ selectMultiple, label, validity, onChange, checked, readonly }: UChecksOption_) {
  const color = useValidationColor(validity)

  return (
    <FormControlLabel
      value={label}
      control={selectMultiple ? <CTick /> : <RTick />}
      label={label}
      sx={{ '.Mui-disabled': { color: `${color} !important` } }}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
  )
}
