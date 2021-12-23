import { Box } from '@mui/material'
import { useState } from 'react'
import { _kittensForListsPage } from '../../../../content/content'
import { UBlocksSet } from '../../UPage/UBlockSet/UBlockSet'

function T() {
  const idsS = useState(_kittensForListsPage.ids)
  return (
    <Box sx={{ width: 700 }}>
      <UBlocksSet id="l" ids={idsS[0]} setIds={idsS[1]} />
    </Box>
  )
}

export const DifferentLists = T

export default {
  title: 'Editing/UList',
}
