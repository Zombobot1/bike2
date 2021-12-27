import { ANSWER_REQUIRED, UInputQuestion as UInputQuestion, UFormFieldData } from '../../types'
import { bool, str } from '../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { Feedback } from '../Feedback'
import { UInputField } from './UInputField'
import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { ucast } from '../../../../utils/utils'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { getUInputScore } from '../scoring'
import { EditableText } from '../../../utils/EditableText/EditableText'
import { TextInput } from '../../../utils/MuiUtils'
import { usePrevious } from '../../../utils/hooks/usePrevious'

export interface UInput extends UFormFieldData {
  hideTipOnMobile?: bool
  autoFocus?: bool
  multiline?: bool
  _answer?: str // for storybook only
}

export function UInput(ps: UInput) {
  if (ps.isEditing) return <UInputEditor {...ps} />
  return <UInput_ {...ps} />
}

const UInput_ = ({
  id,
  data,
  wasSubmitted,
  submissionAttempt,
  onSubmissionAttempt,
  resolveError,
  submitOnAnswer,
  hideTipOnMobile,
  autoFocus,
  multiline,
  _answer = '',
}: UInput) => {
  const [question] = useReactiveObject(ucast(data, new UInputQuestion()))
  const [answer, setAnswer] = useState(_answer)
  const [validationError, setValidationError] = useState('')

  useUpdateEffect(() => {
    if (!submissionAttempt) return
    if (!multiline && !answer.length) {
      setValidationError(ANSWER_REQUIRED)
      onSubmissionAttempt(id, -1)
    } else onSubmissionAttempt(id, !multiline ? getUInputScore(question, answer) : 1)
  }, [submissionAttempt])

  useUpdateEffect(() => {
    if (submitOnAnswer && answer.length) onSubmissionAttempt(id, getUInputScore(question, answer))
  }, [answer])

  const prevWasSubmitted = usePrevious(wasSubmitted)
  useEffect(() => {
    if (prevWasSubmitted && !wasSubmitted) setAnswer('')
  }, [prevWasSubmitted])

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InteractiveQuestion question={question.question} />
      <UInputField
        answer={answer}
        correctAnswer={question.correctAnswer}
        autoFocus={autoFocus}
        multiline={multiline}
        setAnswer={setAnswer}
        hideTipOnMobile={hideTipOnMobile}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
        onChange={(e) => {
          if (e.length && validationError) {
            resolveError(id)
            setValidationError('')
          }
        }}
      />
      <Feedback
        isCorrect={multiline || getUInputScore(question, answer) === 1}
        explanation={question.explanation || question.correctAnswer}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
      />
    </form>
  )
}

function UInputEditor(ps: UInput) {
  const [question, setQuestion] = useReactiveObject(ucast(ps.data, new UInputQuestion()))
  const [validationError, setValidationError] = useState('')

  const updateQuestion = (q: Partial<UInputQuestion>) => setQuestion({ ...question, ...q })

  useUpdateEffect(() => {
    const newQuestion = JSON.stringify(question)
    if (newQuestion !== JSON.stringify(ps.data)) ps.setData(newQuestion)
    if (question.correctAnswer.length && validationError) {
      ps.resolveError(ps.id)
      setValidationError('')
    }
  }, [question])

  useUpdateEffect(() => {
    if (!ps.multiline && !question.correctAnswer.length) {
      setValidationError(ANSWER_REQUIRED)
      ps.onSubmissionAttempt(ps.id, -1, ANSWER_REQUIRED)
    } else ps.onSubmissionAttempt(ps.id, 1)
  }, [ps.submissionAttempt])

  return (
    <Stack spacing={2}>
      <EditableText
        placeholder="Type question"
        text={question.question}
        setText={(q) => updateQuestion({ question: q })}
      />
      {!ps.multiline && (
        <TextInput
          variant="outlined"
          placeholder="Set correct answer"
          defaultValue={question.correctAnswer}
          onBlur={(e) => updateQuestion({ correctAnswer: e.target.value })}
          inputProps={{ 'aria-label': 'correct answer', 'data-cy': 'correct answer' }}
          error={!!validationError}
          helperText={validationError}
        />
      )}
      <TextInput
        color="success"
        variant="filled"
        label="Add explanation"
        defaultValue={question.explanation}
        onBlur={(e) => updateQuestion({ explanation: e.target.value })}
        multiline
        rows={ps.multiline ? 2 : 1}
        inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
      />
    </Stack>
  )
}
