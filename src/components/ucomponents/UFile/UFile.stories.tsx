import { Box } from '@material-ui/core'
import { UBlock } from '../UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  _id: 'file1',
  type: 'FILE',
}

const data2: UBlock = {
  _id: 'file2',
  type: 'FILE',
}

const data3: UBlock = {
  ...data2,
  readonly: true,
}

export const UFileS = {
  ShowsFile: () => <T {...data2} />,
  DeletesFile: () => <T {...data2} />,
  ReadOnly: () => <T {...data3} />,
  UploadsFile: () => <T {...data1} />,
}
