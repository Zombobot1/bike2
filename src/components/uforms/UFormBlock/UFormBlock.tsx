import { Box, Checkbox, Chip, FormControlLabel, Radio, Stack, styled } from '@mui/material'
import { bool, Fn, SetStr, str, strs } from '../../../utils/types'
import { UBlockComponentB, UComponentType, UFormBlockComponent } from '../../editing/types'
import { UChecks } from './UChecks/UChecks'
import { UInput } from './UInput/UInput'
import { useUFormBlock, useUFormBlockEditor } from '../useUForm'
import { Question } from '../../studying/training/types'
import { useState, KeyboardEvent, useRef } from 'react'
import { EditableText } from '../../utils/EditableText/EditableText'
import { CTick, RTick, TextInput } from '../../utils/MuiUtils'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'

export interface UFormFieldBase extends UBlockComponentB {
  id: str
  type: UComponentType
}

export interface UFormBlock extends UFormFieldBase {
  onAnswer?: Fn
  shuffleOptions?: bool
  autoFocus?: bool
  showTipOnMobile?: bool
}

export function UFormBlock(props: UFormBlock) {
  if (!props.data && props.readonly) return null
  if (props.readonly) return <UFormBlock_ {...props} />
  return <UFormBlockEditor {...props} />
}

function UFormBlockEditor({ id: _id, type, data, setData }: UFormFieldBase) {
  const props = useUFormBlockEditor(_id, type as UFormBlockComponent, data, setData, {
    isTextArea: type === 'textarea',
  })
  const { question, onQuestionChange, validationError } = props

  return (
    <Stack spacing={2} sx={{ paddingBottom: '2rem' }}>
      <EditableText
        placeholder="Type question"
        text={question.question}
        setText={(q) => onQuestionChange({ ...question, question: q })}
      />
      {type === 'checks' && <Options selectMultiple={true} {...props} />}
      {type === 'radio' && <Options selectMultiple={false} {...props} />}
      {type === 'input' && (
        <TextInput
          variant="outlined"
          placeholder="Set correct answer"
          defaultValue={question.correctAnswer[0]}
          onBlur={(e) => onQuestionChange({ ...question, correctAnswer: [e.target.value] })}
          inputProps={{ 'aria-label': 'correct answer', 'data-cy': 'correct answer' }}
          error={!!validationError}
          helperText={validationError}
        />
      )}
      {type === 'textarea' && (
        <TextInput
          color="success"
          variant="filled"
          label="Add explanation"
          defaultValue={question.explanation}
          onBlur={(e) => onQuestionChange({ ...question, explanation: e.target.value })}
          multiline
          rows={2}
          inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
        />
      )}
      {type !== 'textarea' && (
        <TextInput
          color="success"
          variant="filled"
          label="Add explanation"
          defaultValue={question.explanation}
          onBlur={(e) => onQuestionChange({ ...question, explanation: e.target.value })}
          multiline
          inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
        />
      )}
    </Stack>
  )
}

interface Options_ {
  selectMultiple: bool
  question: Question
  onQuestionChange: (q: Question) => void
  validationError: str
}

function Options({ selectMultiple, question, onQuestionChange, validationError }: Options_) {
  const [newOptionsCount, setNewOptionsCount] = useState(0)
  const [focusLast, setFocusLast] = useState(false)
  const setOptions = (options: strs) => onQuestionChange({ ...question, options: options.filter(Boolean) })
  const setCorrectAnswer = (correctAnswer: strs) =>
    onQuestionChange({ ...question, correctAnswer: correctAnswer.filter(Boolean) })
  const setOptionsAndAnswer = (options: strs, correctAnswer: strs) => {
    onQuestionChange({ ...question, options: options.filter(Boolean), correctAnswer: correctAnswer.filter(Boolean) })
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
  selectMultiple: bool
  options: strs
  setOptions: (os: strs) => void
  option: str
  correctAnswer: strs
  setCorrectAnswer: (a: strs) => void
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
  selectMultiple: bool
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

function UFormBlock_({ id: _id, type, data, onAnswer, shuffleOptions, autoFocus, showTipOnMobile }: UFormBlock) {
  const props = useUFormBlock(_id, data)

  const commonProps = { _id, ...props, onAnswer }
  const checksProps = { ...commonProps, shuffleOptions }
  const inputProps = { ...commonProps, autoFocus, showTipOnMobile }

  return (
    <Box sx={{ paddingBottom: '2rem' }}>
      {type === 'checks' && <UChecks {...checksProps} selectMultiple={true} />}
      {type === 'radio' && <UChecks {...checksProps} selectMultiple={false} />}
      {type === 'input' && <UInput {...inputProps} multiline={false} />}
      {type === 'textarea' && <UInput {...inputProps} multiline={true} />}
    </Box>
  )
}
