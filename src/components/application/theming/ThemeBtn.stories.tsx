import { Box, Button } from '@material-ui/core'
import { ThemeBtn } from './ThemeBtn'

function T() {
  return (
    <Box sx={{ position: 'relative', width: '300px', height: '100px' }}>
      <Button variant="contained">Press me</Button>
      <ThemeBtn />
    </Box>
  )
}

export const ChangesTheme = T

export default {
  title: 'Utils/ThemeBtn',
}
