import { Box, Chip, FormControlLabel, RadioGroup, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { ushuffle } from '../../../../utils/algorithms'
import { bool, JSObject, num, SetStrs, str, strs } from '../../../../utils/types'
import { COLORS } from '../../../application/theming/theme'

import { CTick, RTick } from '../../../utils/MuiUtils'
import { Correctness } from '../../types'
import { FeedbackIndex } from '../Feedback'
import { useValidationColor } from '../useValidationColor'

export interface UChecksOptions {
  options: strs
  answer: strs
  correctAnswer: strs
  validationError: str
  wasSubmitted: bool
  selectMultiple?: bool
  setAnswer: SetStrs
  overallCorrectness?: Correctness
  inline?: bool
  i?: num
}
export function UChecksOptions({
  answer,
  setAnswer,
  correctAnswer,
  options: initialOptions,
  selectMultiple,
  validationError,
  wasSubmitted,
  i,
  overallCorrectness = 'none',
  inline,
}: UChecksOptions) {
  const [options, setOptions] = useState(initialOptions) // use state to shuffle only once

  function onOptionClick(clickedOption: str) {
    if (answer.includes(clickedOption)) setAnswer(answer.filter((v) => v !== clickedOption))
    else if (!selectMultiple) setAnswer([clickedOption])
    else setAnswer([...answer, clickedOption])
  }

  useEffect(() => {
    setOptions(ushuffle(initialOptions))
  }, [initialOptions])

  const Root = inline ? Box : RadioGroup

  return (
    <Root sx={inline ? { display: 'inline-block', transform: 'translateY(-2px)' } : {}}>
      {inline && <FeedbackIndex i={i} validity={overallCorrectness} wasSubmitted={wasSubmitted} />}
      {options.map((o, i) => {
        let validity: Correctness = 'none'
        const ignoreValidationError = inline && answer.length
        if (validationError && !ignoreValidationError) validity = 'incorrect'
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
            inline={inline}
          />
        )
      })}
    </Root>
  )
}

function optionValidity(option: str, answer: strs, correctAnswer: strs): Correctness {
  if (correctAnswer.includes(option)) return 'correct'
  else if (answer.includes(option) && !correctAnswer.includes(option)) return 'incorrect'
  return 'none'
}

interface UChecksOption_ {
  selectMultiple?: boolean
  label: string
  onChange: (v: string) => void
  checked: boolean
  validity: Correctness
  readonly: boolean
  inline?: bool
}

function UChecksOption({ selectMultiple, label, validity, onChange, checked, readonly, inline }: UChecksOption_) {
  const color = useValidationColor(validity)

  if (inline) {
    let sx: JSObject = {}
    if (readonly || validity === 'incorrect')
      sx = { color: checked ? COLORS.white : color, borderColor: color, backgroundColor: checked ? color : undefined }
    if (selectMultiple) sx = { ...sx, borderRadius: '0.5rem' }

    return (
      <Chip_
        color={!readonly ? 'primary' : 'default'}
        size="small"
        label={label}
        variant={checked ? 'filled' : 'outlined'}
        onClick={!readonly ? () => onChange(label) : undefined}
        sx={sx}
        data-cy={'chip-' + label}
      />
    )
  }

  let sx: JSObject = { '.Mui-disabled': { color: `${color} !important` } }
  if (validity === 'incorrect' && !readonly) sx = { ...sx, '.MuiRadio-root, .MuiCheckbox-root': { color: `${color}` } }

  return (
    <FormControlLabel
      value={label}
      control={selectMultiple ? <CTick /> : <RTick />}
      label={label}
      sx={sx}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
  )
}

const Chip_ = styled(Chip)({
  marginLeft: '4px',
  marginRight: '4px',
})
