import { useEffect, useState } from 'react'
import { Estimations, useUFormSubmit } from './useUForm'
import { sslugify } from '../../utils/sslugify'
import { Question } from '../study/training/types'
import { Alert, Stack, Button, styled, Box, ButtonGroup } from '@material-ui/core'
import { UForm } from './UForm'

interface UQuestion extends Question {
  _id: string
  initialAnswer?: string[]
}
type UQuestions = UQuestion[]

const useQuestions = (questions: UQuestions, submitOneByOne: boolean) => {
  const [questionNumber, setQuestionNumber] = useState(0)
  const [inputs, setInputs] = useState(questions)
  useEffect(() => {
    if (submitOneByOne && questionNumber < questions.length) setInputs([questions[questionNumber]])
  }, [questionNumber])
  const [counter, setCounter] = useState(questions.length)

  const add = () => {
    if (inputs.length > 3) return
    setInputs((is) => [
      ...is,
      { _id: `${counter}`, question: `Question ${counter}`, correctAnswer: ['right'], explanation: 'Cuz', options: [] },
    ])
    setCounter((c) => c + 1)
  }

  const remove = () => {
    if (inputs.length < 2) return
    setInputs((is) => is.filter((_, i) => i !== 0))
  }

  const addAndRemove = () => {
    add()
    remove()
  }

  const nextQuestion = () => setQuestionNumber((n) => n + 1)

  return { inputs, add, remove, addAndRemove, nextQuestion }
}

const useSubmissionsInfo = () => {
  const [counter, setCounter] = useState(1)
  const [info, setInfo] = useState('')

  const onSubmit = (es: Estimations) => {
    const right = es.filter((e) => e.estimation === 'GOOD').length
    const wrong = es.filter((e) => e.estimation === 'BAD').length
    setInfo(`Submission ${counter}. Correct: ${right}. Wrong: ${wrong}`)
    setCounter((c) => c + 1)
  }

  return { info, onSubmit }
}

type TUFormP = {
  questions: UQuestions
  isExtensible: boolean
  submitOneByOne: boolean
  submitOnSelect: boolean
}

const TUForm = ({ questions, isExtensible, submitOneByOne, submitOnSelect: _ }: TUFormP) => {
  const { inputs, add, remove, addAndRemove, nextQuestion } = useQuestions(questions, submitOneByOne)
  const { info, onSubmit } = useSubmissionsInfo()
  const handleSubmit = !submitOneByOne
    ? onSubmit
    : (es: Estimations) => {
        onSubmit(es)
        nextQuestion()
      }

  const { submit } = useUFormSubmit()

  return (
    <Box sx={{ width: '400px' }}>
      <Stack spacing={2}>
        {info && <Alert severity="info">{info}</Alert>}
        {inputs.map((q) => (
          <div key={sslugify(q.question)}>
            <UForm />
          </div>
        ))}
      </Stack>
      <Panel direction="row" spacing={2} justifyContent="flex-end">
        {isExtensible && (
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={add}>+</Button>
            <Button onClick={addAndRemove}>+ -</Button>
            <Button onClick={remove}>-</Button>
          </ButtonGroup>
        )}
        <Button variant="contained" onClick={() => submit(handleSubmit)}>
          Submit
        </Button>
      </Panel>
    </Box>
  )
}

const Panel = styled(Stack)({
  marginTop: 20,
})

const q = (
  _id: string,
  question: string,
  correctAnswer: string,
  explanation: string,
  initialAnswer?: string[],
): UQuestion => ({
  _id,
  question,
  correctAnswer: [correctAnswer],
  explanation,
  options: [],
  initialAnswer,
})
const basicQ = q('basicQ', 'Type: a', 'a', 'Just type it using keyboard', ['a'])
const basicQ2 = q('basicQ2', 'Type: b', 'b', 'Just type it using keyboard', ['a'])
const sillyQ = q('sillyQ', 'Question 1', 'right', 'Cuz')
const select: UQuestion = {
  _id: 'select',
  question: 'Select correct',
  options: ['Correct option', 'Option 2'],
  correctAnswer: ['Correct option'],
  explanation: 'This answer is correct because: Cuz',
}

const sameQuestion1: UQuestion = {
  ...select,
  _id: 'sameQuestion1',
  question: 'Select correct (same question)',
}

const sameQuestion2: UQuestion = {
  ...select,
  _id: 'sameQuestion2',
  question: 'Select correct (same question)',
  correctAnswer: ['Option 2'],
}

const selectMultiple: UQuestion = {
  _id: 'selectMultiple',
  question: 'Select several correct options (long question to check word wrap)',
  options: ['Right', 'Wrong', 'Also right', 'Option'],
  correctAnswer: ['Right', 'Also right'],
  explanation: 'This answer is correct because: Cuz',
  initialAnswer: ['Wrong', 'Also right'],
}

const selectWithInitialAnswer: UQuestion = {
  ...select,
  _id: 'selectWithInitialAnswer',
  initialAnswer: ['Correct option'],
}

const default_: TUFormP = {
  questions: [],
  isExtensible: false,
  submitOneByOne: false,
  submitOnSelect: true,
}

const doNotSubmitIfEmpty: TUFormP = {
  ...default_,
  questions: [sillyQ],
}

const checkAnswersOnSubmission: TUFormP = {
  ...default_,
  questions: [basicQ, basicQ2],
}

const noDataRaceOnAddRemove: TUFormP = {
  ...default_,
  questions: [sillyQ],
  isExtensible: true,
}

const readOnlyAfterSubmit: TUFormP = {
  ...default_,
  questions: [basicQ, basicQ2],
}

const sequentialSubmit: TUFormP = {
  ...default_,
  questions: [basicQ, select, basicQ2],
  submitOneByOne: true,
}

const canContainSameQuestions: TUFormP = {
  ...default_,
  questions: [sameQuestion1, sameQuestion2],
  submitOnSelect: false,
}

const autoSubmitForUInputAndSelectOne: TUFormP = {
  ...default_,
  questions: [basicQ, select],
  submitOneByOne: true,
}

const composite: TUFormP = {
  ...default_,
  questions: [basicQ, selectWithInitialAnswer, selectMultiple],
  submitOnSelect: false,
}

export const DoNotSubmitIfEmpty = () => <TUForm {...doNotSubmitIfEmpty} />
export const CheckAnswersOnSubmission = () => <TUForm {...checkAnswersOnSubmission} />
export const NoDataRaceOnAddRemove = () => <TUForm {...noDataRaceOnAddRemove} />
export const ReadOnlyAfterSubmit = () => <TUForm {...readOnlyAfterSubmit} />
export const SequentialSubmit = () => <TUForm {...sequentialSubmit} />
export const CanContainSameQuestions = () => <TUForm {...canContainSameQuestions} />
export const Composite = () => <TUForm {...composite} />
export const AutoSubmitForUInputAndSelectOne = () => <TUForm {...autoSubmitForUInputAndSelectOne} />
