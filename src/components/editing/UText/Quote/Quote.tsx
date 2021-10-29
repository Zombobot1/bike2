import { Box, styled } from '@mui/material'
import { RStack } from '../../../utils/MuiUtils'
import { UText } from '../types'
import { UText_ } from '../UText_'

export function Quote(props: UText) {
  return (
    <RStack sx={{ flex: 1 }} alignItems="stretch">
      <Box sx={{ paddingBottom: '0.5rem', minWidth: '0.25rem' }}>
        <Left />
      </Box>

      <UText_ {...props} component="pre" />
    </RStack>
  )
}

const Left = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: '0.2rem',
  backgroundColor: theme.palette.primary.main,
}))
