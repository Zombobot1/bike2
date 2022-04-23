import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { f } from '../../../../utils/types'
import { UBlockContent } from '../../types'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { UImageFile } from './UImageFile'
import { useState } from 'react'
import { UMediaFileData } from '../../UPage/ublockTypes'

const { image } = _generators

function T(ps: UBlockContent) {
  const [state, setState] = useState(ps.data as UMediaFileData)
  return (
    <Box sx={{ width: 500 }}>
      {/* <Box sx={{ position: 'relative' }}>
        <img src="src/content/fluffy.jpg" style={{ display: 'block', width: '100%' }} />
        <Box
          sx={{ position: 'absolute', right: 0, bottom: 0, width: '2rem', height: '2rem', backgroundColor: 'red' }}
        ></Box>
      </Box> */}
      <UImageFile {...ps} data={state} setData={(_, src) => setState(src as UMediaFileData)} upageId="" />
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
