import { Box } from '@material-ui/core'
import { UBlock } from '../../UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const t: UBlock = {
  _id: '',
  type: 'IMAGE',
}

const data1: UBlock = {
  ...t,
  _id: 'image1',
}

const data2: UBlock = {
  ...t,
  _id: 'image2',
}

export const ShowsImage = () => T(data1)
export const UploadsImage = () => T(data2)

export default {
  title: 'UComponents/UImageFile',
  component: UBlock,
}
