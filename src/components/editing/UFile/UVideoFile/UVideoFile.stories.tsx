import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { f } from '../../../../utils/types'
import { UBlockContent } from '../../types'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { UVideoFile } from './UVideoFile'

const { video } = _generators

const T = (ps: UBlockContent) => {
  return (
    <Box sx={{ width: 500 }}>
      <UVideoFile {...ps} />
    </Box>
  )
}

const base: UBlockContent = {
  id: '',
  data: '',
  setData: f,
  type: 'video',
}

export const Empty = () => T({ ...base, ...video() })
export const EmptyAndReadonly = () => T({ ...base, ...video(), readonly: true })
export const Resizable = () => T({ ...base, ..._blocks.pets.fluffyVideo })

export default {
  title: 'Editing extras/UVideoFile',
}
