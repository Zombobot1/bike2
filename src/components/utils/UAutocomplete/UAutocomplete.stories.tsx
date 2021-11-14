import { Box } from '@mui/material'
import { range } from 'lodash'
import { UAutocomplete } from './UAutocomplete'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UAutocomplete placeholder="Complete me" value="Option 1" options={range(30).map((_, i) => `Option ${i}`)} />
    </Box>
  )
}

export const ArrowNavigation = T

export default {
  title: 'Utils/UAutocomplete',
}
