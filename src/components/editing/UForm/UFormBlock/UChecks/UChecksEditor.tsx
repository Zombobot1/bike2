import { Box, Checkbox, Chip, FormControlLabel, Radio, Stack, styled } from '@mui/material'
import { useRef, useState, KeyboardEvent } from 'react'
import { bool, Fn, SetStr, SetStrs, str, strs } from '../../../../../utils/types'
import { EditableText } from '../../../../utils/EditableText/EditableText'
import useUpdateEffect from '../../../../utils/hooks/useUpdateEffect'
import { CTick, RTick, TextInput } from '../../../../utils/MuiUtils'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { UChecksData } from '../../../UPage/ublockTypes'
import { UBlockContent } from '../../../types'

export function UChecksEditor({ data: d, id, setData, type }: UBlockContent) {
  const selectMultiple = type === 'multiple-choice'
  const data = d as UChecksData

  useUpdateEffect(() => {
    if (data.correctAnswer.length && data.$error) setData(id, { $error: '' })
  }, [data.correctAnswer, data.$error])

  return (
    <Stack spacing={2}>
      <EditableText placeholder="Type question" text={data.question} setText={(q) => setData(id, { question: q })} />
      <Options
        selectMultiple={selectMultiple}
        question={data}
        updateQuestion={(d) => setData(id, d)}
        error={data.$error}
      />
      <TextInput
        color="success"
        variant="filled"
        label="Add explanation"
        defaultValue={data.explanation}
        onBlur={(e) => setData(id, { explanation: e.target.value })}
        multiline
        inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
      />
    </Stack>
  )
}

interface Options_ {
  question: UChecksData
  updateQuestion: (q: Partial<UChecksData>) => void
  selectMultiple?: bool
  error?: str
}

function Options({ selectMultiple, question, updateQuestion, error }: Options_) {
  const [newOptionsCount, setNewOptionsCount] = useState(0)
  const [focusLast, setFocusLast] = useState(false)
  const setOptions = (options: strs) => updateQuestion({ options: options.filter(Boolean) })
  const setCorrectAnswer = (correctAnswer: strs) => updateQuestion({ correctAnswer: correctAnswer.filter(Boolean) })
  const setOptionsAndAnswer = (options: strs, correctAnswer: strs) => {
    updateQuestion({ options: options.filter(Boolean), correctAnswer: correctAnswer.filter(Boolean) })
  }

  function addNew(option: str) {
    setFocusLast(true)
    setOptions([...question.options, option])
    setNewOptionsCount((c) => c + 1)
  }

  return (
    <div>
      {error && <Warning size="small" color="error" label={error} icon={<ArrowDown />} />}
      <Box sx={{ paddingBottom: '0.5rem' }}>
        {question.options.map((o, i) => (
          <Option
            key={o}
            selectMultiple={selectMultiple}
            option={o}
            options={question.options}
            setOptions={setOptions}
            correctAnswer={question.correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            autoFocus={focusLast && i === question.options.length - 1}
            blurLast={() => setFocusLast(false)}
            setOptionsAndAnswer={setOptionsAndAnswer}
          />
        ))}
        <EmptyOption key={`Add new ${newOptionsCount}`} selectMultiple={selectMultiple} addNew={addNew} />
      </Box>
    </div>
  )
}

const Warning = styled(Chip)({
  marginBottom: '0.5rem',
})

const ArrowDown = styled(ReplyRoundedIcon)({
  transform: 'rotate(-90deg)',
})

interface Option_ {
  selectMultiple?: bool
  options: strs
  setOptions: SetStrs
  option: str
  correctAnswer: strs
  setCorrectAnswer: SetStrs
  setOptionsAndAnswer: (o: strs, a: strs) => void
  autoFocus: bool
  blurLast: Fn
}

function Option({
  selectMultiple,
  options,
  setOptions,
  option,
  correctAnswer,
  setCorrectAnswer,
  setOptionsAndAnswer,
  autoFocus,
  blurLast,
}: Option_) {
  const ref = useRef<HTMLInputElement>(null)
  const [newValue, setNewValue] = useState(option)

  function onOptionClick(clickedOption: str) {
    if (correctAnswer.includes(clickedOption)) setCorrectAnswer(correctAnswer.filter((v) => v !== clickedOption))
    else if (!selectMultiple) setCorrectAnswer([clickedOption])
    else setCorrectAnswer([...correctAnswer, clickedOption])
    blurLast()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !newValue) ref.current?.blur()
  }

  return (
    <Stack direction="row">
      <Tick
        label=""
        control={selectMultiple ? <CTick /> : <RTick />}
        checked={correctAnswer.includes(option)}
        onChange={() => onOptionClick(option)}
      />
      <OptionLabel
        variant="standard"
        placeholder="Type option"
        defaultValue={option}
        onChange={(e) => setNewValue(e.target.value)}
        onBlur={(e) => {
          if (correctAnswer.includes(option))
            setOptionsAndAnswer(
              [...options.map((o) => (o !== option ? o : e.target.value))],
              [...correctAnswer.map((a) => (a !== option ? a : e.target.value))],
            )
          else setOptions([...options.map((o) => (o !== option ? o : e.target.value))])
          blurLast()
        }}
        autoFocus={autoFocus}
        inputRef={ref}
        onKeyDown={onKeyDown}
        inputProps={{ 'aria-label': 'option', 'data-cy': 'option' }}
      />
    </Stack>
  )
}

interface EmptyOption_ {
  selectMultiple?: bool
  addNew: SetStr
}

function EmptyOption({ selectMultiple, addNew }: EmptyOption_) {
  return (
    <Stack direction="row">
      <Tick label="" control={selectMultiple ? <Checkbox /> : <Radio />} checked={false} />
      <OptionLabel
        variant="standard"
        placeholder="Add option"
        onChange={(e) => addNew(e.target.value)}
        inputProps={{ 'aria-label': 'new option', 'data-cy': 'new option' }}
      />
    </Stack>
  )
}

const Tick = styled(FormControlLabel)({
  marginRight: '0.25rem',
})

const OptionLabel = styled(TextInput)({
  transform: 'translateY(5px)',
})
