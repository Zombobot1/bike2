import { Box } from '@material-ui/core'
import { fn, setStr } from '../../../../utils/types'
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
  addNewBlock: fn,
  deleteBlock: setStr,
}

const data1: UBlock = {
  ...t,
  _id: 'image1',
}

const data2: UBlock = {
  ...t,
  _id: 'image2',
}

export const UImageFileS = {
  ShowsImage: () => <T {...data1} />,
  UploadsImage: () => <T {...data2} />,
}
