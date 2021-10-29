import { Box } from '@mui/system'
import { UBlock } from '../../UBlock/UBlock'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data: UBlock = {
  id: 'catQuote',
}

export const RichQuote = T(data)

export default {
  title: 'Editing/Quote',
}
