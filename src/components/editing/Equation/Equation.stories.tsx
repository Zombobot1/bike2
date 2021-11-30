import { Box } from '@mui/material'
import { UBlock } from '../UBlock/UBlock'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  id: 'newEquation',
  initialData: { data: '', type: 'block-equation' },
}

const readonly: UBlock = {
  id: 'readonlyEquation',
  initialData: { data: 'A=\\frac{1}{2}', type: 'block-equation' },
  readonly: true,
}

export const Empty = T(data1)
export const Readonly = T(readonly)
export const Complex = T({ id: 'waveEquation' })

export default {
  title: 'Editing/Equation',
}
