import { Box, styled } from '@mui/material'
import produce from 'immer'
import { bool, num, str, strs } from '../../../../../utils/types'
import { isStr, safe } from '../../../../../utils/utils'
import { UBlockContent } from '../../../types'
import { InlineExerciseData, SubQuestion, SubQuestions, UBlockType } from '../../../UPage/ublockTypes'
import { Feedback } from '../Feedback'
import { InteractiveQuestion } from '../interactive-question'
import { UChecksOptions } from '../UChecks/UChecksOptions'
import { UInputField } from '../UInput/UInputField'
import { InlineExerciseEditor } from './InlineQuestionEditor'
import { isSubQuestionCorrect } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'

export interface InlineExercise extends UBlockContent {
  showTipOnMobile?: bool
  autoFocus?: bool
}

export function InlineExercise(ps: InlineExercise) {
  const data = ps.data as InlineExerciseData
  const editing = data.$editing
  if (editing) return <InlineExerciseEditor {...ps} />
  return <InlineExercise_ {...ps} />
}

function InlineExercise_({ id, data: d, setData, autoFocus, showTipOnMobile }: InlineExercise) {
  const data = d as InlineExerciseData
  const questions = data.content.filter((sq) => !isStr(sq)) as SubQuestions
  const submitted = data.$submitted
  const error = questions.find((q) => q.$error)?.$error
  const setAnswer = (i: num, _answer: strs) =>
    setData(
      id,
      produce(data, (draft) => {
        const questions = draft.content.filter((sq) => !isStr(sq)) as SubQuestions
        questions[i].$answer = _answer
        if (questions[i].$error && _answer.length) questions[i].$error = ''
      }),
    )
  return (
    <Box>
      <InteractiveQuestion question="Complete exercise:" needsBigMargin={true} isExercise={true} />
      <Form onSubmit={(e) => e.preventDefault()}>
        {data.content.map((q, i) => {
          if (isStr(q)) return <span key={i}>{q}</span>
          if (q.type === 'short-answer')
            return (
              <UInputField
                key={i}
                answer={q.$answer?.[0] || ''}
                setAnswer={(a) => setAnswer(q.i, [a])}
                correctAnswer={q.correctAnswer[0]}
                error={q.$error}
                submitted={submitted}
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
              answer={q.$answer || []}
              setAnswer={(a) => setAnswer(q.i, a)}
              correctAnswer={q.correctAnswer}
              error={q.$error}
              submitted={submitted}
              selectMultiple={q.type === 'multiple-choice'}
              inline={true}
              i={questions.length > 1 ? q.i : undefined}
            />
          )
        })}
        {submitted &&
          questions.map((q, i) => {
            return (
              <Feedback
                key={i}
                explanation={getExplanation(q, questions.length, i, safe(q.type))}
                error=""
                isCorrect={isSubQuestionCorrect(q.type, q)}
                submitted={true}
              />
            )
          })}
        {error && <Feedback explanation="" error={error} isCorrect={false} submitted={false} />}
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
