import { Box, Checkbox, Chip, FormControlLabel, Radio, Stack, styled } from '@mui/material'
import { useRef, useState, KeyboardEvent } from 'react'
import { bool, Fn, SetStr, SetStrs, str, strs } from '../../../../utils/types'
import { ucast } from '../../../../utils/utils'
import { EditableText } from '../../../utils/EditableText/EditableText'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { CTick, RTick, TextInput } from '../../../utils/MuiUtils'
import { SELECT_CORRECT, UChecksDTO, UFormFieldData } from '../../types'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'

export function UChecksEditor(ps: UFormFieldData & { selectMultiple?: bool }) {
  const [question, setQuestion] = useReactiveObject(ucast(ps.data, { ...new UChecksDTO(), options: ['Option 1'] }))
  const [validationError, setValidationError] = useState('')

  const updateQuestion = (q: Partial<UChecksDTO>) => setQuestion({ ...question, ...q })

  useUpdateEffect(() => {
    const newQuestion = JSON.stringify(question)
    if (newQuestion !== JSON.stringify(ps.data)) ps.setData(newQuestion)
    if (question.correctAnswer.length && validationError) {
      ps.resolveError(ps.id)
      setValidationError('')
    }
  }, [question])

  useUpdateEffect(() => {
    if (!question.correctAnswer.length) {
      setValidationError(SELECT_CORRECT)
      ps.onSubmissionAttempt(ps.id, -1, SELECT_CORRECT)
    } else ps.onSubmissionAttempt(ps.id, 1)
  }, [ps.submissionAttempt])

  return (
    <Stack spacing={2}>
      <EditableText
        placeholder="Type question"
        text={question.question}
        setText={(q) => updateQuestion({ question: q })}
      />
      <Options
        selectMultiple={ps.selectMultiple}
        question={question}
        updateQuestion={updateQuestion}
        validationError={validationError}
      />
      <TextInput
        color="success"
        variant="filled"
        label="Add explanation"
        defaultValue={question.explanation}
        onBlur={(e) => updateQuestion({ explanation: e.target.value })}
        multiline
        inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
      />
    </Stack>
  )
}

interface Options_ {
  question: UChecksDTO
  updateQuestion: (q: Partial<UChecksDTO>) => void
  selectMultiple?: bool
  validationError: str
}

function Options({ selectMultiple, question, updateQuestion, validationError }: Options_) {
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
      {validationError && <Warning size="small" color="error" label={validationError} icon={<ArrowDown />} />}
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
