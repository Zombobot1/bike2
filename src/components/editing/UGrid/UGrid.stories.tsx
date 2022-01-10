import { Box } from '@mui/material'
import { useState } from 'react'
import { _idsForBuildColumns } from '../../../content/content'
import { mockUblock, UBlock } from '../UBlock/UBlock'
import { SetForStories } from '../UBlockSet/SetForStories'

function T() {
  return (
    <Box sx={{ width: '70%' }}>
      <UBlock {...mockUblock} id="cat-lists-columns" />
    </Box>
  )
}

function T2() {
  const [ids] = useState(_idsForBuildColumns)
  return (
    <Box sx={{ width: '70%' }}>
      <SetForStories id="g" ids={ids} />
    </Box>
  )
}

export const AddsAndDeletesBlocks = T
export const BuildColumns = T2

export default {
  title: 'Editing/UGrid',
}
