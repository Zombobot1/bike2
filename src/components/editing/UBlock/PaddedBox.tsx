import { Box, BoxProps } from '@mui/system'
import { Children, num } from '../../../utils/types'

interface PaddedBox {
  pt?: num
  pb?: num
  p?: num
  sx?: BoxProps['sx']
  children: Children
}

export function PaddedBox({ children, pt, pb, sx, p = 0.5 }: PaddedBox) {
  return (
    <Box sx={{ ...sx, paddingTop: pt ? pt + `rem` : p + `rem`, paddingBottom: pb ? pb + `rem` : p + `rem` }}>
      {children}
    </Box>
  )
}
