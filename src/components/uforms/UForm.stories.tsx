import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../editing/UBlock/UBlock'
import { _fuzzyQuiz } from '../../content/content'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const empty: UBlock = {
  ...mockUblock,
  id: 'empty-exercise',
  initialData: { data: '', type: 'exercise' },
}

const emptyWithName: UBlock = {
  ...mockUblock,
  id: 'empty-named-exercise',
  initialData: { data: JSON.stringify({ name: 'Form', ids: [] }), type: 'exercise' },
}

const submit: UBlock = {
  ...mockUblock,
  id: 'submit-exercise',
  initialData: _fuzzyQuiz,
}

export const Empty = () => T(empty)
export const EmptyWithName = () => T(emptyWithName)
export const Submit = () => T(submit)

export default {
  title: 'UForms/UForm',
}
