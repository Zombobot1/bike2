import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { f } from '../../../utils/types'
import { UBlockContent } from '../types'
import { UEquation } from './UEquation'

const T = (ps: UBlockContent) => {
  return (
    <Box sx={{ width: 500 }}>
      <UEquation {...ps} />
    </Box>
  )
}

const base: UBlockContent = {
  id: '',
  data: '',
  setData: f,
  type: 'block-equation',
}

export const Empty = () => T(base)
export const Readonly = () => T({ ...base, data: 'A=\\frac{1}{2}', readonly: true })
export const Complex = () => T({ ...base, ..._blocks.pets.waveEquation })

export default {
  title: 'Editing extras/Equation',
}
