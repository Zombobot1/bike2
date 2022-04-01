import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { f } from '../../../utils/types'
import { UBlockContent } from '../types'
import { _generators } from '../UPage/UPageState/crdtParser/_fakeUPage'
import { UFile } from './UFile'

const { file } = _generators

const T = (ps: UBlockContent) => {
  return (
    <Box sx={{ width: 500 }}>
      <UFile {...ps} />
    </Box>
  )
}

const base: UBlockContent = {
  id: '',
  data: '',
  setData: f,
  type: 'file',
}

export const ShowsFile = () => T({ ...base, ..._blocks.pets.fluffyPdf })
export const ReadOnly = () => T({ ...base, ..._blocks.pets.fluffyPdf, readonly: true })
export const UploadsFile = () => T({ ...base, ...file() })

export default {
  title: 'Editing extras/UFile',
}
