import { useEffect, useState } from 'react'
import { UChecksFieldData, Validity } from '../types'
import { Question } from '../../study/training/types'
import { fn } from '../../../utils/types'
import _ from 'lodash'
import { InteractiveQuestion } from './interactive-question'
import { RadioGroup } from '@material-ui/core'
import { ErrorText, SuccessText } from './feedback'
import { shuffle } from '../../../utils/algorithms'
import { USelectInput } from './USelectInput'

export interface UChecksP extends UChecksFieldData {
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
}: UChecksP) => {
  const question_ = handleEmptyQuestion(question)

  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    if (answer[0] && submitOnSelect) setCanSubmit(true)
  }, [answer])

  useEffect(() => {
    if (canSubmit) {
      onAnswer()
      setCanSubmit(false)
    }
  }, [canSubmit])

  return (
    <UChecksElement
      _id={_id}
      onChange={onAnswerChange}
      value={answer}
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

function optionValidity(option: string, value: string[], correctAnswer: string[]): Validity {
  if (correctAnswer.includes(option)) return 'VALID'
  else if (value.includes(option) && !correctAnswer.includes(option)) return 'INVALID'
  return 'NONE'
}

export interface UChecksElementP {
  _id: string
  question: Question
  value: string[]
  onChange: (value: string[]) => void
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
    if (value.includes(clickedOption)) onChange(value.filter((v) => v !== clickedOption))
    else if (!selectMultiple) onChange([clickedOption])
    else onChange([...value, clickedOption])
  }

  useEffect(() => {
    if (!wasSubmitted) return
    const invalidOption = question.options.find((o) => optionValidity(o, value, question.correctAnswer) === 'INVALID')
    setOverallValidity(invalidOption ? 'INVALID' : 'VALID')
  }, [wasSubmitted])

  useEffect(() => {
    if (shuffleOptions) setOptions(shuffle(question.options))
    else setOptions(question.options)
  }, [question.options])

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
