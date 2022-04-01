import { Box } from '@mui/material'
import { useState } from 'react'
import { _catTable } from '../../../content/blocks'
import { UTableData } from '../UPage/ublockTypes'
import { UTable } from './UTable'

const T = (d: UTableData) => {
  const [data, setData] = useState(d)
  return (
    <Box sx={{ width: 500 }}>
      <UTable data={data} setData={(_, d) => setData(d as [])} id="" type="table" />
    </Box>
  )
}

const table: UTableData = [
  {
    rows: ['00', '01'],
    width: 190,
  },
  {
    rows: ['01', '11'],
    width: 190,
  },
]

export const Default = () => T(_catTable)
export const Small = () => T(table)

export default {
  title: 'Editing extras/UTable',
}
