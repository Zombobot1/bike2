import { Box } from '@mui/material'
import { useState } from 'react'
import { SetForStories } from '../UBlockSet/SetForStories'

const T = () => {
  const s = useState(['kittens', 'divider', 'kittens2'])
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories id="d" ids={s[0]} />
    </Box>
  )
}

export const Divided = T

export default {
  title: 'Editing/UDivider',
}
