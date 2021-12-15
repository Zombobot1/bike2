import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../../UBlock/UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  ...mockUblock,
  id: 'fluffyJpg',
}

const data2: UBlock = {
  ...mockUblock,
  id: 'newImage',
  initialData: { data: '', type: 'image' },
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
