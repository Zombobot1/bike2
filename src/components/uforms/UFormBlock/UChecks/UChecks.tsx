import { ANSWER_REQUIRED, UChecksDTO as UChecksDTO, UFormFieldData } from '../../types'
import { bool, strs } from '../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { Box } from '@mui/material'
import { Feedback } from '../Feedback'
import { UChecksOptions } from './UChecksOptions'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { ucast } from '../../../../utils/utils'
import { useState, useEffect } from 'react'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { getUChecksScore } from '../scoring'
import { UChecksEditor } from './UChecksEditor'
import { usePrevious } from '../../../utils/hooks/usePrevious'

export interface UChecks extends UFormFieldData {
  selectMultiple?: bool
  _answer?: strs // for storybook only
}

export function UChecks(ps: UChecks) {
  if (ps.isEditing) return <UChecksEditor {...ps} />
  return <UChecks_ {...ps} />
}

const UChecks_ = ({
  id,
  data,
  submissionAttempt,
  onSubmissionAttempt,
  resolveError,
  wasSubmitted,
  submitOnAnswer,
  selectMultiple,
  _answer = [],
}: UChecks) => {
  const [question] = useReactiveObject(ucast(data, new UChecksDTO()))
  const [answer, setAnswer] = useState<strs>(_answer)
  const [validationError, setValidationError] = useState('')

  useUpdateEffect(() => {
    if (!submissionAttempt) return
    if (!answer.length) {
      setValidationError(ANSWER_REQUIRED)
      onSubmissionAttempt(id, -1, ANSWER_REQUIRED)
    } else onSubmissionAttempt(id, getUChecksScore(question, answer))
  }, [submissionAttempt])

  useUpdateEffect(() => {
    if (submitOnAnswer && !selectMultiple && answer.length) onSubmissionAttempt(id, getUChecksScore(question, answer))
    else if (answer.length && validationError) {
      resolveError(id)
      setValidationError('')
    }
  }, [answer])

  const prevWasSubmitted = usePrevious(wasSubmitted)
  useEffect(() => {
    if (prevWasSubmitted && !wasSubmitted) setAnswer([])
  }, [prevWasSubmitted])

  return (
    <Box>
      <InteractiveQuestion question={question.question} />
      <UChecksOptions
        answer={answer}
        correctAnswer={question.correctAnswer}
        setAnswer={setAnswer}
        options={question.options}
        selectMultiple={selectMultiple}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
      />
      <Feedback
        isCorrect={getUChecksScore(question, answer) === 1}
        explanation={question.explanation}
        validationError={validationError}
        wasSubmitted={wasSubmitted}
      />
    </Box>
  )
}
