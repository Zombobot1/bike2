import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../UBlock/UBlock'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...data} />
    </Box>
  )
}

const data: UBlock = {
  ...mockUblock,
  id: 'catTable',
}

export const Default = T

export default {
  title: 'Editing/UTable',
}
