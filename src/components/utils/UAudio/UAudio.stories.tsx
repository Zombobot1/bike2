import { Box } from '@material-ui/core'

import long from '../../../content/long.mp3'
import { fn } from '../../../utils/types'
import { UAudio } from './UAudio'

function T() {
  return (
    <Box sx={{ width: 500 }}>
      <UAudio src={long} onDelete={fn} />
    </Box>
  )
}

export const PlaysAndPauses = T

export default {
  title: 'Utils/UAudio',
}
