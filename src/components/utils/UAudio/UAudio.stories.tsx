import { Box } from '@mui/material'

import long from '../../../content/long.mp3'
import fluffy from '../../../content/fluffy.mp3'
import { f } from '../../../utils/types'
import { UAudio } from './UAudio'

function T() {
  return (
    <Box sx={{ width: 500 }}>
      <UAudio src={long} onDelete={f} />
    </Box>
  )
}

function T2() {
  return (
    <Box sx={{ width: 500 }}>
      <UAudio src={fluffy} onDelete={f} />
    </Box>
  )
}

export const PlaysAndPauses = T
export const PlayIconShowsWhenAudioEnds = T2

export default {
  title: 'Utils/UAudio',
}
