import { Box, Stack } from '@mui/material'
import { useRef } from 'react'
import { Rec } from '../../../utils/Rec'
import { UBlock } from '../../UBlock'
import { ResizableWidth } from '../../../utils/ResizableWidth/ResizableWidth'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  id: 'fluffyJpg',
}

const data2: UBlock = {
  id: 'newImage',
  initialData: { data: '', type: 'IMAGE' },
}

const data3: UBlock = {
  ...data1,
  readonly: true,
}

export const ResizesImage = () => T(data1)
export const Readonly = () => T(data3)
export const UploadsImage = () => T(data2)

export default {
  title: 'Editing/UImageFile',
}
