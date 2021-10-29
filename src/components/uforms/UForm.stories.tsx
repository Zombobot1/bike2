import { useUForm } from './useUForm'
import { Stack, Button, styled, Box } from '@mui/material'
import { UForm } from './UForm'
import { UBlockB } from '../editing/types'
import { UBlock } from '../editing/UBlock/UBlock'
import { _fuzzyQuiz } from '../../content/content'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const empty: UBlock = {
  id: 'empty-exercise',
  initialData: { data: '', type: 'exercise' },
}

const emptyWithName: UBlock = {
  id: 'empty-named-exercise',
  initialData: { data: JSON.stringify({ name: 'Form', ids: [] }), type: 'exercise' },
}

const submit: UBlock = {
  id: 'submit-exercise',
  initialData: _fuzzyQuiz,
}

export const Empty = T(empty)
export const EmptyWithName = T(emptyWithName)
export const Submit = T(submit)

export default {
  title: 'UForms/UForm',
}
