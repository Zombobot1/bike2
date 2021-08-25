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
  type: 'AUDIO',
  addNewBlock: fn,
  deleteBlock: setStr,
}

const data1: UBlock = {
  ...t,
  _id: 'audio1',
}

const data2: UBlock = {
  ...t,
  _id: 'audio2',
}

const data3: UBlock = {
  ...data1,
  readonly: true,
}

export const UAudioFileS = {
  ShowsAudio: () => <T {...data1} />,
  DeletesAudio: () => <T {...data1} />,
  ReadOnly: () => <T {...data3} />,
  UploadsAudio: () => <T {...data2} />,
}
