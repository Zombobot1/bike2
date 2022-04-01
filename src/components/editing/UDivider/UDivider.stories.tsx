import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { SetForStories } from '../UPage/UBlockSet/SetForStories'
import { _generators } from '../UPage/UPageState/crdtParser/_fakeUPage'

const { div } = _generators

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories blocks={[_blocks.pets.kittens1, div(), _blocks.pets.kittens2]} />
    </Box>
  )
}

export const Divided = T

export default {
  title: 'Editing extras/UDivider',
}
