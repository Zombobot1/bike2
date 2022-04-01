import { Box } from '@mui/material'
import { useState } from 'react'
import { TOCs } from '../UPageState/types'
import { TableOfContents } from './TableOfContents'

const data: TOCs = [
  { data: 'Feline Behavior', id: '0', type: 'heading-1' },
  { data: 'Normal Behavior of Cats', id: '1', type: 'heading-2' },
  { data: 'Kitten Development', id: '2', type: 'heading-3' },
  { data: 'Kitten Socialization and Training Classes', id: '3', type: 'heading-3' },
  { data: 'Behavioral History Taking', id: '4', type: 'heading-2' },
  { data: 'Behavior Problems', id: '5', type: 'heading-2' },
  { data: 'Feline Internal', id: '6', type: 'heading-1' },
  { data: 'Quiz', id: '7', type: 'heading-1' },
]

const T = () => {
  const s = useState(false)

  return (
    <Box
      sx={{
        height: '100%',
        '.MuiPaper-root': {
          transform: 'translateX(-20rem) !important',
        },
      }}
    >
      <TableOfContents getTOC={() => data} isOpenS={s} />
    </Box>
  )
}

const T2 = () => {
  const s = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <TableOfContents getTOC={() => data} isOpenS={s} />
    </Box>
  )
}

export const Default = T
export const SlidesIn = T2

export default {
  title: 'Editing core/TableOfContents',
}
