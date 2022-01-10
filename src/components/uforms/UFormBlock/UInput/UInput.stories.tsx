import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { bool, fn } from '../../../../utils/types'
import { deleteUBlockInfo, setUBlockInfo } from '../../../editing/UPage/blockIdAndInfo'
import { useMount } from '../../../utils/hooks/hooks'
import { UInputDTO } from '../../types'
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
type T2 = UInput & { isLong?: bool }
const T2 = (ps: T2) => {
  const formPs = useUForm({ isEditing: true, id: 'f' })
  const { d, score } = formPs
  const [data, setData] = useState(ps.data)

  useMount(() => {
    setUBlockInfo(ps.id, { setId: 'f', type: ps.isLong ? 'long-answer' : 'short-answer' })
    return () => deleteUBlockInfo(ps.id)
  })

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

const q1: UInputDTO = { question: 'Type abc', correctAnswer: 'abc', explanation: 'It is easy' }

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

const shortEditing: T2 = {
  ...defaultI,
  data: '',
}

const textEditing: T2 = {
  ...text,
  data: '',
  isLong: true,
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
