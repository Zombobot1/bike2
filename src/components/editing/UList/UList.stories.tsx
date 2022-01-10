import { Box } from '@mui/material'
import { useState } from 'react'
import { _kittensForListsPage } from '../../../content/content'
import { SetForStories } from '../UBlockSet/SetForStories'

function T() {
  const idsS = useState(_kittensForListsPage.ids)
  return (
    <Box sx={{ width: 700 }}>
      <SetForStories id="l" ids={idsS[0]} />
    </Box>
  )
}

export const DifferentLists = T

export default {
  title: 'Editing/UList',
}
