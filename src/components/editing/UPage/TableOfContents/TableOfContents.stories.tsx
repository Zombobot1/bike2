import { Box } from '@mui/material'
import { useState } from 'react'
import { useMount } from '../../../utils/hooks/hooks'
import { deleteUBlockInfo, setUBlockInfo } from '../blockIdAndInfo'
import { TableOfContents } from './TableOfContents'
import { TOCItems } from './types'

const data: TOCItems = [
  { i: 0, data: 'Feline Behavior', id: '0', type: 'heading-1' },
  { i: 1, data: 'Normal Behavior of Cats', id: '1', type: 'heading-2' },
  { i: 2, data: 'Kitten Development', id: '2', type: 'heading-3' },
  { i: 3, data: 'Kitten Socialization and Training Classes', id: '3', type: 'heading-3' },
  { i: 4, data: 'Behavioral History Taking', id: '4', type: 'heading-2' },
  { i: 5, data: 'Behavior Problems', id: '5', type: 'heading-2' },
  { i: 6, data: 'Feline Internal', id: '6', type: 'heading-1' },
  { i: 7, data: 'Quiz', id: '7', type: 'heading-1' },
]

const T = () => {
  const s = useState(false)

  useMount(() => {
    data.forEach((d) => setUBlockInfo(d.id, { ...d }))
    return data.forEach((d) => deleteUBlockInfo(d.id))
  })

  return (
    <Box
      sx={{
        height: '100%',
        '.MuiPaper-root': {
          transform: 'translateX(-20rem) !important',
        },
      }}
    >
      <TableOfContents isOpenS={s} />
    </Box>
  )
}

const T2 = () => {
  const s = useState(false)

  useMount(() => {
    data.forEach((d) => setUBlockInfo(d.id, { ...d }))
    return data.forEach((d) => deleteUBlockInfo(d.id))
  })

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <TableOfContents isOpenS={s} />
    </Box>
  )
}

export const Default = T
export const SlidesIn = T2

export default {
  title: 'Editing/TableOfContents',
}
