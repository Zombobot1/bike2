import { Box } from '@mui/material'
import { UBlock } from '../UBlock/UBlock'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...data} />
    </Box>
  )
}

const data: UBlock = {
  id: 'catTable',
}

export const Default = T

export default {
  title: 'Editing/UTable',
}
