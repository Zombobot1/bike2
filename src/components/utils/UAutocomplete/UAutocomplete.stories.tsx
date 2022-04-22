import { Box } from '@mui/material'
import { gen } from '../../../utils/algorithms'
import { f } from '../../../utils/types'
import { MUIBasedAutocomplete, UAutocomplete } from './UAutocomplete'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UAutocomplete
        placeholder="Complete me"
        selected="Option 1"
        options={gen(30, (i) => `Option ${i}`)}
        onSelect={f}
      />
    </Box>
  )
}

const T2 = () => {
  return (
    <Box sx={{ width: 500 }}>
      <MUIBasedAutocomplete
        placeholder="Complete me"
        selected="Option 1"
        options={gen(30, (i) => `Option ${i}`)}
        onSelect={f}
      />
    </Box>
  )
}

export const Default = T

export const MaterialAutocomplete = T2

export default {
  title: 'Utils/UAutocomplete',
}
