import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../UBlock/UBlock'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  ...mockUblock,
  id: 'newFile',
  initialData: { data: '', type: 'file' },
}

const data2: UBlock = {
  ...mockUblock,
  id: 'catPdf',
}

const data3: UBlock = {
  ...data2,
  readonly: true,
}

export const ShowsFile = T(data2)
export const ReadOnly = T(data3)
export const UploadsFile = T(data1)

export default {
  title: 'Editing/UFile',
}
