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

const data1: UBlock = {
  id: 'fluffyMp3',
}

const data2: UBlock = {
  id: 'newAudio',
  initialData: { data: '', type: 'AUDIO' },
}

const data3: UBlock = {
  ...data1,
  readonly: true,
}

export const ShowsAudio = () => T(data1)
export const ReadOnly = () => T(data3)
export const UploadsAudio = () => T(data2)

export default {
  title: 'Editing/UAudioFile',
}
