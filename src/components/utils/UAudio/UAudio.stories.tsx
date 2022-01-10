import { Box } from '@mui/material'

import long from '../../../content/long.mp3'
import fluffy from '../../../content/fluffy.mp3'
import { fn } from '../../../utils/types'
import { UAudio } from './UAudio'

function T() {
  return (
    <Box sx={{ width: 500 }}>
      <UAudio src={long} onDelete={fn} />
    </Box>
  )
}

function T2() {
  return (
    <Box sx={{ width: 500 }}>
      <UAudio src={fluffy} onDelete={fn} />
    </Box>
  )
}

export const PlaysAndPauses = T
export const PlayIconShowsWhenAudioEnds = T2

export default {
  title: 'Utils/UAudio',
}
