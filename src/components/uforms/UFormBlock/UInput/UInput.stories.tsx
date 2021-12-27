import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { fn } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { UInputQuestion } from '../../types'
import { useUForm } from '../../useUForm'
import { UInput } from './UInput'

const T = (ps: UInput) => {
  const [sa, ssa] = useState(ps.submissionAttempt)

  useMount(() => {
    if (sa) ssa(sa + 1)
  })

  return (
    <div style={{ width: 500 }}>
      <UInput {...ps} submissionAttempt={sa} />
    </div>
  )
}

const T2 = (ps: UInput) => {
  const formPs = useUForm({ isEditing: true, ids: ['1'] })
  const { d, score } = formPs
  const [data, setData] = useState(ps.data)
  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <UInput {...ps} data={data} setData={setData} {...formPs} />
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

const q1: UInputQuestion = { question: 'Type abc', correctAnswer: 'abc', explanation: 'It is easy' }

const defaultI: UInput = {
  id: 'defaultI',
  data: JSON.stringify(q1),
  wasSubmitted: false,
  submitOnAnswer: false,
  submissionAttempt: 0,
  onSubmissionAttempt: fn,
  setData: fn,
  resolveError: fn,
}

const rightI: UInput = {
  ...defaultI,
  _answer: 'abc',
  wasSubmitted: true,
}

const wrongI: UInput = {
  ...rightI,
  _answer: 'ab',
}

const invalidI: UInput = {
  ...defaultI,
  submissionAttempt: 1,
}

const text: UInput = {
  ...defaultI,
  multiline: true,
}

const textSubmitted: UInput = {
  ...text,
  _answer: 'ab',
  wasSubmitted: true,
}

const shortEditing: UInput = {
  ...defaultI,
  data: '',
}

const textEditing: UInput = {
  ...text,
  data: '',
}

export const ShortAnswer = () => T(defaultI)
export const Right = () => T(rightI)
export const Wrong = () => T(wrongI)
export const Invalid = () => T(invalidI)
export const ShortAnswerEditing = () => T2(shortEditing)
export const LongAnswer = () => T(text)
export const LongAnswerSubmitted = () => T(textSubmitted)
export const LongAnswerEditing = () => T2(textEditing)

export default {
  title: 'UForms/UInput',
  order: [
    'ShortAnswer',
    'Right',
    'Wrong',
    'Invalid',
    'ShortAnswerEditing',
    'LongAnswer',
    'LongAnswerSubmitted',
    'LongAnswerEditing',
  ],
}
