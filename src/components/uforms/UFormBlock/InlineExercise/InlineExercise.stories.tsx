import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { bool, fn } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { ComplexQuestion } from '../../types'
import { useUForm } from '../../useUForm'
import { InlineExercise } from './InlineExercise'

function T(ps: InlineExercise) {
  const [sa, ssa] = useState(ps.submissionAttempt)

  useMount(() => {
    if (sa) ssa(sa + 1)
  })

  return (
    <Box sx={{ width: 500 }}>
      <Stack>
        <InlineExercise {...ps} submissionAttempt={sa} />
      </Stack>
    </Box>
  )
}

function T2(ps: InlineExercise) {
  const [sa, ssa] = useState(ps.submissionAttempt)
  const [wasSubmitted, setWasSubmitted] = useState(ps.wasSubmitted)

  useMount(() => {
    if (sa) ssa(sa + 1)
  })

  return (
    <Box sx={{ width: 500 }}>
      <InlineExercise
        {...ps}
        submissionAttempt={sa}
        wasSubmitted={wasSubmitted}
        onSubmissionAttempt={() => setWasSubmitted(true)}
      />
    </Box>
  )
}
type T3 = InlineExercise & { goToSubmit?: bool }
const T3 = (ps: T3) => {
  const formPs = useUForm({ isEditing: !ps.goToSubmit, ids: ['1'] })
  const { d, score } = formPs
  const [data, setData] = useState(ps.data)
  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <InlineExercise {...ps} data={data} setData={setData} {...formPs} />
        {formPs.isEditing && (
          <Button onClick={() => d({ a: 'toggle-edit' })} data-cy="create">
            Create
          </Button>
        )}
        {!formPs.isEditing && !formPs.wasSubmitted && (
          <Button onClick={() => d({ a: 'submit' })} data-cy="submit">
            Submit
          </Button>
        )}
        {score > -1 && (
          <Button onClick={() => d({ a: 'retry' })} data-cy="retry">
            Retry {score}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

const qs: ComplexQuestion = [
  'Some dummy text ',
  { i: 0, correctAnswer: ['a'], explanation: '', options: [], type: 'short-answer' },
  ' another text ',
  { i: 1, correctAnswer: ['b'], explanation: '', options: [], type: 'short-answer' },
  ' the end.\nSelect right ',
  { i: 2, correctAnswer: ['right'], explanation: 'coz))', options: ['right', 'not right'], type: 'single-choice' },
  " it's easy.\n\nOne more time: ",
  {
    i: 3,
    correctAnswer: ['also wrong'],
    explanation: 'gotcha)))',
    options: ['wrong', 'also wrong'],
    type: 'multiple-choice',
  },
  ", but now it's tricky.",
]

const data: InlineExercise = {
  id: 'InlineExercise',
  data: JSON.stringify(qs),
  setData: fn,
  wasSubmitted: false,
  submitOnAnswer: false,
  onSubmissionAttempt: fn,
  submissionAttempt: 0,
  resolveError: fn,
}

const submitted: InlineExercise = {
  ...data,
  _answer: [
    [0, ['a']],
    [1, ['b2']],
    [2, ['right']],
    [3, ['wrong']],
  ],
  wasSubmitted: true,
}

const invalid: InlineExercise = {
  ...data,
  _answer: [
    [0, ['a']],
    [2, ['right']],
  ],
  submissionAttempt: 1,
}

const selectOnly: ComplexQuestion = [
  'Select right ',
  { i: 2, correctAnswer: ['right'], explanation: 'coz))', options: ['right', 'not right'], type: 'single-choice' },
  " it's easy.",
]

const shortOnly: ComplexQuestion = [
  'Type "a" ',
  { i: 2, correctAnswer: ['a'], explanation: '', options: [], type: 'short-answer' },
  " it's easy.",
]

const submitsOnAnswer: InlineExercise = {
  ...data,
  data: JSON.stringify(selectOnly),
  submitOnAnswer: true,
}

const submitsOnEnter: InlineExercise = {
  ...submitsOnAnswer,
  data: JSON.stringify(shortOnly),
}

const editing: InlineExercise = {
  ...data,
  data: '',
}

const filling: T3 = {
  ...data,
  goToSubmit: true,
}

export const Default = () => T(data)
export const Submitted = () => T(submitted)
export const Invalid = () => T(invalid)
export const SubmitsOnAnswer = () => T2(submitsOnAnswer)
export const SubmitsOnEnter = () => T2(submitsOnEnter)
export const Editing = () => T3(editing)
export const Filling = () => T3(filling)

export default {
  title: 'UForms/InlineExercise',
  order: ['Default', 'Submitted', 'Invalid', 'SubmitsOnAnswer', 'SubmitsOnEnter', 'Editing', 'Filling'],
}
