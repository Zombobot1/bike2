import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { _kittensForListsPage } from '../../../../content/content'
import { UBlock } from '../../UBlock'
import { UBlocksSet } from '../../UPage/UBlocksSet/UBlocksSet'
import { UList } from './UList'

function T() {
  const idsS = useState(_kittensForListsPage.ids)
  return (
    <Box sx={{ width: 700 }}>
      <UBlocksSet idsS={idsS} />
    </Box>
  )
}

export const DifferentLists = T

export default {
  title: 'Editing/UList',
}
