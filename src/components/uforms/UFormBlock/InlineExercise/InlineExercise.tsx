import { Box, styled } from '@mui/material'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { bool, num, str, strs } from '../../../../utils/types'
import { safe, ucast } from '../../../../utils/utils'
import { UBlockType } from '../../../editing/types'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { useMap } from '../../../utils/hooks/useMap'
import { usePrevious } from '../../../utils/hooks/usePrevious'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { ANSWER_REQUIRED, InlineExerciseDTO, SubQuestion, SubQuestions, UFormFieldData } from '../../types'
import { Feedback } from '../Feedback'
import { InteractiveQuestion } from '../interactive-question'
import { getComplexScore, isAnswerCorrect } from '../scoring'
import { UChecksOptions } from '../UChecks/UChecksOptions'
import { UInputField } from '../UInput/UInputField'
import { InlineExerciseEditor } from './InlineQuestionEditor'

export interface InlineExercise extends UFormFieldData {
  showTipOnMobile?: bool
  autoFocus?: bool
  _answer?: [num, strs][] // for storybook only
}

export function InlineExercise(ps: InlineExercise) {
  if (ps.isEditing) return <InlineExerciseEditor {...ps} />
  return <InlineExercise_ {...ps} />
}

function InlineExercise_({
  id,
  data,
  submissionAttempt,
  onSubmissionAttempt,
  wasSubmitted,
  submitOnAnswer,
  autoFocus,
  resolveError,
  showTipOnMobile,
  _answer = [],
}: InlineExercise) {
  const [complexQuestion] = useReactiveObject(ucast<InlineExerciseDTO>(data, []))
  const questions = complexQuestion.filter((q) => !_.isString(q)) as SubQuestions
  const answers = useMap<num, strs>(_answer)
  const [validationError, setValidationError] = useState('')

  useUpdateEffect(() => {
    if (!submissionAttempt) return
    const givenAnswers = answers.values()
    const notAllQuestionsWereRegistered = givenAnswers.length < questions.length
    const notAllQuestionsAreAnswered = !!givenAnswers.find((a) => !a.length)
    if (notAllQuestionsWereRegistered || notAllQuestionsAreAnswered) {
      setValidationError(ANSWER_REQUIRED)
      onSubmissionAttempt(id, -1, ANSWER_REQUIRED)
    } else onSubmissionAttempt(id, getComplexScore(questions, answers._data))
  }, [submissionAttempt])

  useUpdateEffect(() => {
    const givenAnswers = answers.values()
    const allQuestionsWereRegistered = givenAnswers.length === questions.length
    const allQuestionsAreAnswered = !givenAnswers.find((a) => !a.length)
    const canSubmit = allQuestionsWereRegistered && allQuestionsAreAnswered
    const canSubmitOnAnswer = questions.length === 1 && !questions.find((q) => q.type === 'multiple-choice')
    if (submitOnAnswer && canSubmitOnAnswer && canSubmit)
      onSubmissionAttempt(id, getComplexScore(questions, answers._data))
    if (canSubmit && validationError) {
      resolveError(id)
      setValidationError('')
    }
  }, [JSON.stringify(answers.entries())])

  const prevWasSubmitted = usePrevious(wasSubmitted)
  useEffect(() => {
    if (prevWasSubmitted && !wasSubmitted) {
      answers.reset()
    }
  }, [prevWasSubmitted])

  return (
    <Box>
      <InteractiveQuestion question="Complete exercise:" needsBigMargin={true} isExercise={true} />
      <Form onSubmit={(e) => e.preventDefault()}>
        {complexQuestion.map((q, i) => {
          if (_.isString(q)) return <span key={i}>{q}</span>
          if (q.type === 'short-answer')
            return (
              <UInputField
                key={i}
                answer={answers.get(q.i)?.at(0) || ''}
                setAnswer={(a) => answers.set(q.i, [a])}
                correctAnswer={q.correctAnswer[0]}
                validationError={validationError}
                wasSubmitted={wasSubmitted}
                autoFocus={autoFocus}
                hideTipOnMobile={showTipOnMobile}
                inline={true}
                i={questions.length > 1 ? q.i : undefined}
              />
            )
          return (
            <UChecksOptions
              key={i}
              options={q.options}
              answer={answers.get(q.i) || []}
              setAnswer={(a) => answers.set(q.i, a)}
              correctAnswer={q.correctAnswer}
              validationError={validationError}
              wasSubmitted={wasSubmitted}
              selectMultiple={q.type === 'multiple-choice'}
              inline={true}
              i={questions.length > 1 ? q.i : undefined}
            />
          )
        })}
        {wasSubmitted &&
          questions.map((q, i) => {
            return (
              <Feedback
                key={i}
                explanation={getExplanation(q, questions.length, i, safe(q.type))}
                validationError=""
                isCorrect={isAnswerCorrect(answers.get(i) || [], q.correctAnswer)}
                wasSubmitted={true}
              />
            )
          })}
        {validationError && (
          <Feedback explanation="" validationError={validationError} isCorrect={false} wasSubmitted={false} />
        )}
      </Form>
    </Box>
  )
}

const Form = styled('form')({
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  fontSize: '1.25rem',
})

function getExplanation(question: SubQuestion, questionsNumber: num, i: num, type: UBlockType): str {
  if (type !== 'short-answer' && questionsNumber === 1) return ''
  const number = questionsNumber === 1 ? '' : `${i + 1}. `
  const correctAnswer = question.correctAnswer.join(', ')
  const explanation = question.explanation ? ` - ${question.explanation}` : ''
  return `${number}${correctAnswer}${explanation}`
}
