import { Box } from '@mui/material'
import { useState } from 'react'
import { UBlock } from '../../UBlock/UBlock'
import { UBlocksSet } from '../UBlocksSet/UBlocksSet'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock id="how-pets-changed-humanity" />
    </Box>
  )
}

const T2 = () => {
  const [ids, si] = useState(['how-pets-changed-humanity', 'kittensS', 'kittensH2L'])
  return (
    <Box sx={{ width: 500 }}>
      <UBlocksSet ids={ids} setIds={si} />
    </Box>
  )
}

export const Default = T
export const MoveBlocksByDrop = T2

export default {
  title: 'Editing/UPageBlock',
}
