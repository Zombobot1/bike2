import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { bool, num, str, strs } from '../../../../../utils/types'
import { isStr } from '../../../../../utils/utils'
import { RStack } from '../../../../utils/MuiUtils'
import { InlineExerciseData, UBlock } from '../../../UPage/ublockTypes'
import { _generators } from '../../../UPage/UPageState/crdtParser/_fakeUPage'
import { useTestUPageState } from '../../../UPage/UPageState/UPageState'
import { InlineExercise } from './InlineExercise'

const { e, ied, ufd, ie, subq } = _generators

type T = UBlock & { answers?: Map<num, strs>; errors?: Map<num, str>; submitted?: bool; activeQuestion?: num }

const T = (ps: T) => {
  const d = ps.data as InlineExerciseData
  if (ps.submitted) {
    d.$submitted = true
  }

  if (ps.answers) {
    d.content.forEach((b) => {
      if (isStr(b)) return
      b.$answer = ps.answers?.get(b.i)
    })
  }

  if (ps.errors) {
    d.content.forEach((b) => {
      if (!isStr(b)) b.$error = ps.errors?.get(b.i)
    })
  }

  return () => {
    const [data, setData] = useState(d)

    return (
      <Box sx={{ width: 500 }}>
        <InlineExercise {...ps} data={data} setData={(_, d) => setData(d as InlineExerciseData)} />
      </Box>
    )
  }
}

const T2 = (block: UBlock, activeQuestion: num) => {
  const s = useTestUPageState([block])

  const uf = ufd(s)

  const data = ied(uf)
  const submitted = data.$submitted

  const [activeI, setActiveI] = useState(activeQuestion)
  return (
    <Stack spacing={1} sx={{ width: 500 }}>
      <InlineExercise
        id={uf.ublocks[0].id}
        data={data}
        setData={s.changer.change}
        type={uf.ublocks[0].type}
        activeQuestionIds={[String(activeI - 1), String(activeI)]}
      />
      <RStack>
        <Button onClick={() => setActiveI((o) => (o || 0) - 1)}>Prev</Button>
        {!submitted && (
          <Button onClick={() => s.changer.handleUFormEvent('e', 'submit')} data-cy="submit">
            Submit
          </Button>
        )}
        <Button onClick={() => setActiveI((o) => (o || 0) + 1)}>Next</Button>
      </RStack>
    </Stack>
  )
}

const T3 = (block: UBlock) => {
  const s = useTestUPageState([block])

  const uf = ufd(s)
  const score = uf.$score ?? -1

  const data = ied(uf)
  const editing = data.$editing
  const submitted = data.$submitted

  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={2}>
        <InlineExercise id={uf.ublocks[0].id} data={data} setData={s.changer.change} type={uf.ublocks[0].type} />
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

const ieBlock = ie(
  'Some dummy text ',
  subq(0, '_', ['a']),
  ' another text ',
  subq(1, '_', ['b']),
  ' the end.\nSelect right ',
  subq(2, '(', ['right'], 'coz))', ['right', 'not right']),
  " it's easy.\n\nOne more time: ",
  subq(3, '[', ['also wrong'], 'gotcha)))', ['wrong', 'also wrong']),
  ", but now it's tricky.",
)

const submitted: T = {
  ...structuredClone(ieBlock),
  answers: new Map([
    [0, ['a']],
    [1, ['b2']],
    [2, ['right']],
    [3, ['wrong']],
  ]),
  submitted: true,
}

const invalid: T = {
  ...structuredClone(ieBlock),
  answers: new Map([
    [0, ['a']],
    [2, ['right']],
  ]),
  errors: new Map([
    [1, 'ERR'],
    [3, 'ERR'],
  ]),
}

export const Default = T(ieBlock)
export const Submitted = T(submitted)
export const Invalid = T(invalid)
export const Editing = () => T3(e([ie()], true))
export const Filling = () => T3(e([structuredClone(ieBlock)]))
export const ShowActive = () => T2(e([structuredClone(ieBlock)]), 1)

export default {
  title: 'UForms/InlineExercise',
  order: ['Default', 'Submitted', 'Invalid', 'SubmitsOnAnswer', 'SubmitsOnEnter', 'Editing', 'Filling', 'ShowActive'],
}
