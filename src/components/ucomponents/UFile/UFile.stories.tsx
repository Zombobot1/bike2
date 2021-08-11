import { Box } from '@material-ui/core'
import { fn, setStr } from '../../../utils/types'
import { UBlock } from '../UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const t: UBlock = {
  _id: '',
  type: 'FILE',
  addNewBlock: fn,
  deleteBlock: setStr,
}

const data1: UBlock = {
  ...t,
  _id: 'file1',
}

const data2: UBlock = {
  ...t,
  _id: 'file2',
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
