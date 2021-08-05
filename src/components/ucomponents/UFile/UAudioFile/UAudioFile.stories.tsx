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
  _id: 'audio1',
  type: 'AUDIO',
}

const data2: StrBlock = {
  _id: 'audio2',
  type: 'AUDIO',
}

const data3: StrBlock = {
  ...data1,
  readonly: true,
}

export const UAudioFileS = {
  ShowsAudio: () => <T {...data1} />,
  DeletesAudio: () => <T {...data1} />,
  ReadOnly: () => <T {...data3} />,
  UploadsAudio: () => <T {...data2} />,
}
