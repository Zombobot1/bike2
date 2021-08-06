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
  _id: 'audio1',
  type: 'AUDIO',
}

const data2: UBlock = {
  _id: 'audio2',
  type: 'AUDIO',
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
