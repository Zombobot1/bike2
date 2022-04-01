import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { f } from '../../../../utils/types'
import { UBlockContent } from '../../types'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { UImageFile } from './UImageFile'

const { image } = _generators

function T(ps: UBlockContent) {
  return (
    <Box sx={{ width: 500 }}>
      <UImageFile {...ps} />
    </Box>
  )
}

const base: UBlockContent = {
  id: '',
  data: '',
  setData: f,
  type: 'image',
}

export const ResizesImage = () => T({ ...base, ..._blocks.pets.fluffyImg })
export const Readonly = () => T({ ...base, ..._blocks.pets.fluffyImg, readonly: true })
export const UploadsImage = () => T({ ...base, ...image() })

export default {
  title: 'Editing extras/UImageFile',
}
