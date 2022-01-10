import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../UBlock/UBlock'
import { UTableDTO } from './UTable'

const T = (data: UBlock) => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...data} />
    </Box>
  )
}

const data: UBlock = {
  ...mockUblock,
  id: 'catTable',
}

const table: UTableDTO = {
  rows: [
    ['00', '01'],
    ['10', '11'],
  ],
  widths: [190, 190],
}

const newTable: UBlock = {
  ...mockUblock,
  id: 'newTable',
  initialData: { type: 'table', data: JSON.stringify(table) },
}

export const Default = () => T(data)
export const Small = () => T(newTable)

export default {
  title: 'Editing/UTable',
}
