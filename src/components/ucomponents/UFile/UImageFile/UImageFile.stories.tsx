import { Box } from '@material-ui/core'
import { StrBlock } from '../../StrBlock'

function T(props: StrBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <StrBlock {...props} />
    </Box>
  )
}

const data1: StrBlock = {
  _id: 'image1',
  type: 'IMAGE',
}

const data2: StrBlock = {
  _id: 'image2',
  type: 'IMAGE',
}

export const UImageFileS = {
  ShowsImage: () => <T {...data1} />,
  UploadsImage: () => <T {...data2} />,
}
