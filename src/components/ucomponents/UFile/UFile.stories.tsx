import { Box } from '@material-ui/core'
import { StrBlock } from '../StrBlock'

function T(props: StrBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <StrBlock {...props} />
    </Box>
  )
}

const data1: StrBlock = {
  _id: 'file data1',
  type: 'FILE',
}

const data2: StrBlock = {
  _id: 'file data2',
  type: 'FILE',
}

export const UFileS = {
  UploadsFile: () => <T {...data1} />,
  ShowsFile: () => <T {...data2} />,
}
