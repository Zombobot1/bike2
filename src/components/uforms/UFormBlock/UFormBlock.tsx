import { Checkbox, FormControlLabel, Radio, Stack, styled, TextField, Typography } from '@material-ui/core'
import { bool, Fn, SetStr, str, strs } from '../../../utils/types'
import { UBlockComponent, UFormBlockComponent } from '../../editing/types'
import { UChecks } from './UChecks/UChecks'
import { UInput } from './UInput/UInput'
import { useUFormBlock, useUFormBlockEditor } from '../useUForm'
import { Question } from '../../studying/training/types'
import { useState, KeyboardEvent, useRef } from 'react'

export interface UFormFieldBase extends UBlockComponent {
  _id: str
  type: UFormBlockComponent
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

function UFormBlockEditor({ _id, type, data, setData }: UFormFieldBase) {
  const props = useUFormBlockEditor(_id, type, data, setData)
  const { question, onQuestionChange } = props

  return (
    <Stack spacing={2}>
      <TextField
        variant="standard"
        placeholder="Type question"
        defaultValue={question.question}
        onBlur={(e) => onQuestionChange({ ...question, question: e.target.value })}
        multiline
        inputProps={{ 'aria-label': 'question', 'data-cy': 'question' }}
      />
      {type === 'CHECKS' && <Options selectMultiple={true} {...props} />}
      {type === 'RADIO' && <Options selectMultiple={false} {...props} />}
      {type === 'INPUT' && (
        <TextField
          variant="outlined"
          placeholder="Set correct answer"
          defaultValue={question.correctAnswer[0]}
          onBlur={(e) => onQuestionChange({ ...question, correctAnswer: [e.target.value] })}
          inputProps={{ 'aria-label': 'correct answer', 'data-cy': 'correct answer' }}
        />
      )}
      {type === 'TEXTAREA' && (
        <TextField
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
      {type !== 'TEXTAREA' && (
        <TextField
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
}

function Options({ selectMultiple, question, onQuestionChange }: Options_) {
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
      {!question.correctAnswer.length && <Typography color="text.secondary">Select correct answer</Typography>}
      {question.options.map((o, i) => {
        return (
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
        )
      })}
      <EmptyOption key={`Add new ${newOptionsCount}`} selectMultiple={selectMultiple} addNew={addNew} />
    </div>
  )
}

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
        control={
          selectMultiple ? (
            <Checkbox inputProps={{ 'aria-label': 'option tick' }} />
          ) : (
            <Radio inputProps={{ 'aria-label': 'option tick' }} />
          )
        }
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

const OptionLabel = styled(TextField)({
  transform: 'translateY(5px)',
})

function UFormBlock_({ _id, type, data, onAnswer, shuffleOptions, autoFocus, showTipOnMobile }: UFormBlock) {
  const props = useUFormBlock(_id, data)

  const commonProps = { _id, ...props, onAnswer }
  const checksProps = { ...commonProps, shuffleOptions }
  const inputProps = { ...commonProps, autoFocus, showTipOnMobile }

  return (
    <>
      {type === 'CHECKS' && <UChecks {...checksProps} selectMultiple={true} />}
      {type === 'RADIO' && <UChecks {...checksProps} selectMultiple={false} />}
      {type === 'INPUT' && <UInput {...inputProps} multiline={false} />}
      {type === 'TEXTAREA' && <UInput {...inputProps} multiline={true} />}
    </>
  )
}
