import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { f } from '../../../../utils/types'
import { UBlockContent } from '../../types'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { UAudioFile } from './UAudioFile'

const { audio } = _generators

function T(ps: UBlockContent) {
  return (
    <Box sx={{ width: 500 }}>
      <UAudioFile {...ps} />
    </Box>
  )
}

const base: UBlockContent = {
  id: '',
  data: '',
  setData: f,
  type: 'audio',
}

export const ShowsAudio = () => T({ ...base, ..._blocks.pets.fluffyAudio })
export const ReadOnly = () => T({ ...base, ..._blocks.pets.fluffyAudio, readonly: true })
export const UploadsAudio = () => T({ ...base, ...audio() })

export default {
  title: 'Editing extras/UAudioFile',
}
