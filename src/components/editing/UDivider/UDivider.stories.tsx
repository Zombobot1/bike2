import { Box } from '@mui/material'
import { useState } from 'react'
import { UBlocksSet } from '../UPage/UBlocksSet/UBlocksSet'

const T = () => {
  const s = useState(['kittens', 'divider', 'kittens2'])
  const t = useState('Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <UBlocksSet ids={s[0]} setIds={s[1]} readonly={false} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

export const Divided = T

export default {
  title: 'Editing/UDivider',
}
