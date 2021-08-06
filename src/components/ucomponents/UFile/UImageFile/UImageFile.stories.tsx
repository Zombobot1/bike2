import { Box } from '@material-ui/core'
import { UBlock } from '../../UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  _id: 'image1',
  type: 'IMAGE',
}

const data2: UBlock = {
  _id: 'image2',
  type: 'IMAGE',
}

export const UImageFileS = {
  ShowsImage: () => <T {...data1} />,
  UploadsImage: () => <T {...data2} />,
}
