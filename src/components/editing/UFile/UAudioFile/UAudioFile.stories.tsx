import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { f } from '../../../../utils/types'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { UAudioFile } from './UAudioFile'
import { UFile } from '../types'

const { audio } = _generators

function T(ps: UFile) {
  return (
    <Box sx={{ width: 500 }}>
      <UAudioFile {...ps} />
    </Box>
  )
}

const base: UFile = {
  id: '',
  data: '',
  setData: f,
  type: 'audio',
  upageId: '',
}

export const ShowsAudio = () => T({ ...base, ..._blocks.pets.fluffyAudio })
export const ReadOnly = () => T({ ...base, ..._blocks.pets.fluffyAudio, readonly: true })
export const UploadsAudio = () => T({ ...base, ...audio() })

export default {
  title: 'Editing extras/UAudioFile',
}
