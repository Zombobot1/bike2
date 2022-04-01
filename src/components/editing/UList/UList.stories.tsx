import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { SetForStories } from '../UPage/UBlockSet/SetForStories'

const blocks = [
  _blocks.test.bathYourCat,
  _blocks.test.bathYourCatList,
  _blocks.test.whyOwnCat,
  _blocks.test.whyOwnCatList,
  _blocks.test.healthyCat,
  _blocks.test.healthyCatList,
  _blocks.test.hypoallergenicCat,
  _blocks.test.hypoallergenicCatList,
]

function T() {
  return (
    <Box sx={{ width: 700 }}>
      <SetForStories blocks={blocks} />
    </Box>
  )
}

export const DifferentLists = T

export default {
  title: 'Editing extras/UList',
}
