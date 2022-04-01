import { Box, Button, Stack } from '@mui/material'
import { UInput } from './UInput'
import { useTestUPageState } from '../../../UPage/UPageState/UPageState'
import { UBlock } from '../../../UPage/ublockTypes'
import { _generators } from '../../../UPage/UPageState/crdtParser/_fakeUPage'
import { UInputField } from './UInputField'
import { f } from '../../../../../utils/types'

const { e, uid, ufd, saq, laq } = _generators

const T = (ps: UInputField) => {
  return (
    <div style={{ width: 500 }}>
      <UInputField {...ps} />
    </div>
  )
}
const T2 = (block: UBlock) => {
  const s = useTestUPageState([block])

  const uf = ufd(s)
  const score = uf.$score ?? -1

  const data = uid(uf)

  const editing = data.$editing
  const submitted = data.$submitted

  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <UInput id={uf.ublocks[0].id} data={data} setData={s.changer.change} type={uf.ublocks[0].type} />
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

const defaultI: UInputField = {
  correctAnswer: 'abc',
  setAnswer: f,
}

const rightI: UInputField = {
  ...defaultI,
  answer: 'abc',
  submitted: true,
}

const wrongI: UInputField = {
  ...rightI,
  answer: 'ab',
}

const invalidI: UInputField = {
  ...defaultI,
  error: 'Answer required',
}

const text: UInputField = {
  ...defaultI,
  multiline: true,
}

const textSubmitted: UInputField = {
  ...text,
  answer: 'ab',
  submitted: true,
}

export const ShortAnswer = () => T(defaultI)
export const Right = () => T(rightI)
export const Wrong = () => T(wrongI)
export const Invalid = () => T(invalidI)
export const ShortAnswerEditing = () => T2(e([saq('', '')], true))
export const LongAnswer = () => T(text)
export const LongAnswerSubmitted = () => T(textSubmitted)
export const LongAnswerEditing = () => T2(e([laq()], true))

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
