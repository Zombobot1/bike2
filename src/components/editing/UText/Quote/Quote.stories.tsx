import { Box } from '@mui/system'
import { UBlock, mockUblock } from '../../UBlock/UBlock'

const T = (props: UBlock) => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data: UBlock = {
  ...mockUblock,
  id: 'catQuote',
}

export const RichQuote = () => T(data)

export default {
  title: 'Editing/Quote',
}
