import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { UBlock as UBlockDTO } from '../UPage/ublockTypes'
import { _generators } from '../UPage/UPageState/crdtParser/_fakeUPage'
import { useTestUPageState } from '../UPage/UPageState/UPageState'
import { UForm } from './UForm'

const { e, ex, ufd } = _generators

function T(formBlock: UBlockDTO) {
  const s = useTestUPageState([formBlock])

  return (
    <Box sx={{ width: 500 }}>
      <UForm
        data={ufd(s)}
        setData={s.changer.change}
        handleUFormEvent={s.changer.handleUFormEvent}
        id={s.ublocks[0].id}
        type="exercise"
      />
    </Box>
  )
}

export const Empty = () => T(e([], true, ''))
export const EmptyWithName = () => T(ex('Form'))
export const Submit = () => T(_blocks.test.fuzzyQuizShort)
export const SubmitExercise = () => T(_blocks.test.quizWith1InlineExercise)
export const Submit1Input = () => T(_blocks.test.quizWith1InputField)

export default {
  title: 'UForms/UForm',
}
