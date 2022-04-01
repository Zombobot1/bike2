import { Box } from '@mui/system'
import { _catQuote } from '../../../../content/blocks'
import { _mockUTextP } from '../types'
import { Quote } from './Quote'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <Quote {..._mockUTextP} type={'quote'} data={_catQuote} />
    </Box>
  )
}

export const RichQuote = () => T()

export default {
  title: 'Editing extras/Quote',
}
