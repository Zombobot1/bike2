import { UChecks } from './UChecks'
import { useState } from 'react'
import { bool, f } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { UChecksDTO } from '../../types'
import { useUForm } from '../../useUForm'
import { Box, Button, Stack } from '@mui/material'
import { deleteUBlockInfo, setUBlockInfo } from '../../../editing/UPage/blockIdAndInfo'

const T = (ps: UChecks) => {
  const [sa, ssa] = useState(ps.submissionAttempt)

  useMount(() => {
    if (sa) ssa(sa + 1)
  })

  return (
    <div style={{ width: 500 }}>
      <UChecks {...ps} submissionAttempt={sa} />
    </div>
  )
}
type T2 = UChecks & { isMultiple?: bool }
const T2 = (ps: T2) => {
  const formPs = useUForm({ isEditing: true, id: 'f' })
  const { d, score } = formPs
  const [data, setData] = useState(ps.data)

  useMount(() => {
    setUBlockInfo(ps.id, { setId: 'f', type: ps.isMultiple ? 'multiple-choice' : 'single-choice' })
    return () => deleteUBlockInfo(ps.id)
  })

  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <UChecks {...ps} data={data} setData={setData} {...formPs} />
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

const selectOneOptions = [
  'Option 1',
  'Option 2',
  'Looooooooooooooooooong text inside this option renders without visual deffects',
]
const selectOneCorrectAnswer = ['Option 1']

const qr: UChecksDTO = {
  question: 'Please select',
  options: selectOneOptions,
  correctAnswer: selectOneCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
}

const selectOne: UChecks = {
  id: 'radioData',
  data: JSON.stringify(qr),
  submissionAttempt: 0,
  onSubmissionAttempt: f,
  resolveError: f,
  submitOnAnswer: false,
  wasSubmitted: false,
  setData: f,
}

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong']
const selectMultipleCorrectAnswer = ['Right', 'Also right']

const qc: UChecksDTO = {
  question: 'Please select',
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  explanation: 'This is a loooooooooooooooooooooong Cuz',
}

const selectMany: UChecks = {
  ...selectOne,
  data: JSON.stringify(qc),
  selectMultiple: true,
}

const right: UChecks = {
  ...selectOne,
  wasSubmitted: true,
  _answer: ['Option 1'],
}

const wrong: UChecks = {
  ...selectOne,
  wasSubmitted: true,
  _answer: ['Option 2'],
}
const invalid: UChecks = {
  ...selectOne,
  submissionAttempt: 1,
}

const wrongMultiple: UChecks = {
  ...selectMany,
  wasSubmitted: true,
  _answer: ['Right', 'Also wrong', 'Wrong'],
}

const selectOneEditing: T2 = {
  ...selectOne,
  data: '',
}
const selectManyEditing: T2 = {
  ...selectMany,
  data: '',
  isMultiple: true,
}

export const SingleChoice = () => T(selectOne)
export const SingleChoiceRight = () => T(right)
export const SingleChoiceWrong = () => T(wrong)
export const SingleChoiceInvalid = () => T(invalid)
export const SingleChoiceEditing = () => T2(selectOneEditing)
export const MultipleChoice = () => T(selectMany)
export const MultipleChoiceWrong = () => T(wrongMultiple)
export const MultipleChoiceEditing = () => T2(selectManyEditing)

export default {
  title: 'UForms/UChecks',
  order: [
    'SingleChoice',
    'SingleChoiceRight',
    'SingleChoiceWrong',
    'SingleChoiceInvalid',
    'SingleChoiceEditing',
    'MultipleChoice',
    'MultipleChoiceWrong',
    'MultipleChoiceEditing',
  ],
}
