import { Box } from '@mui/material'
import { Hr } from '../../utils/MuiUtils'

export function UDivider() {
  return (
    <Box sx={{ height: '1.5rem' }}>
      <Box sx={{ paddingTop: '0.75rem' }}>
        <Hr />
      </Box>
    </Box>
  )
}
