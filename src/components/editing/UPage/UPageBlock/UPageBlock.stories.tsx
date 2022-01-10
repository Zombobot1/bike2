import { Box } from '@mui/material'
import { useState } from 'react'
import { UBlock, mockUblock } from '../../UBlock/UBlock'
import { SetForStories } from '../../UBlockSet/SetForStories'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...mockUblock} id="how-pets-changed-humanity" />
    </Box>
  )
}

const T2 = () => {
  const [ids] = useState(['how-pets-changed-humanity', 'kittensS', 'kittensH2L'])
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories id="b" ids={ids} />
    </Box>
  )
}

export const Default = T
export const MoveBlocksByDrop = T2

export default {
  title: 'Editing/UPageBlock',
}
