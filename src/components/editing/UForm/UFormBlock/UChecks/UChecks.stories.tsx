import { UChecks } from './UChecks'
import { useState } from 'react'
import { f } from '../../../../../utils/types'
import { Box, Button, Stack } from '@mui/material'
import { UChecksOptions } from './UChecksOptions'
import { _generators } from '../../../UPage/UPageState/crdtParser/_fakeUPage'
import { UBlock } from '../../../UPage/ublockTypes'
import { useTestUPageState } from '../../../UPage/UPageState/UPageState'

const { ucd, ufd, mcq, scq, e } = _generators

const T = (ps: UChecksOptions) => {
  const [answer, setAnswer] = useState(ps.answer)
  return (
    <div style={{ width: 500 }}>
      <UChecksOptions {...ps} answer={answer} setAnswer={setAnswer} />
    </div>
  )
}
const T2 = (block: UBlock) => {
  const s = useTestUPageState([block])

  const uf = ufd(s)
  const score = uf.$score ?? -1

  const data = ucd(uf)
  const editing = data.$editing
  const submitted = data.$submitted

  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <UChecks id={uf.ublocks[0].id} data={data} setData={s.changer.change} type={uf.ublocks[0].type} />
        {editing && (
          <Button onClick={() => s.changer.handleUFormEvent('e', 'toggle-edit')} data-cy="create">
            Create
          </Button>
        )}
        {!editing && !submitted && (
          <Button onClick={() => s.changer.handleUFormEvent('e', 'submit')} data-cy="submit">
            Submit
          </Button>
        )}
        {score > -1 && (
          <Button onClick={() => s.changer.handleUFormEvent('e', 'retry')} data-cy="retry">
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

const selectOne: UChecksOptions = {
  options: selectOneOptions,
  correctAnswer: selectOneCorrectAnswer,
  setAnswer: f,
}

const selectMultipleOptions = ['Right', 'Also right', 'Wrong', 'Option', 'Also wrong']
const selectMultipleCorrectAnswer = ['Right', 'Also right']

const selectMany: UChecksOptions = {
  options: selectMultipleOptions,
  correctAnswer: selectMultipleCorrectAnswer,
  setAnswer: f,
  selectMultiple: true,
}

const right: UChecksOptions = {
  ...selectOne,
  submitted: true,
  answer: ['Option 1'],
}

const wrong: UChecksOptions = {
  ...selectOne,
  submitted: true,
  answer: ['Option 2'],
}
const invalid: UChecksOptions = {
  ...selectOne,
  error: 'Answer required',
}

const wrongMultiple: UChecksOptions = {
  ...selectMany,
  submitted: true,
  answer: ['Right', 'Also wrong', 'Wrong'],
}

export const SingleChoice = () => T(selectOne)
export const SingleChoiceRight = () => T(right)
export const SingleChoiceWrong = () => T(wrong)
export const SingleChoiceInvalid = () => T(invalid)
export const SingleChoiceEditing = () => T2(e([scq('', [], ['Option 1', 'Option 2'])], true))
export const MultipleChoice = () => T(selectMany)
export const MultipleChoiceWrong = () => T(wrongMultiple)
export const MultipleChoiceEditing = () => T2(e([mcq('', [], ['Option 1', 'Option 2'])], true))

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
