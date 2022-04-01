import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { JSObject } from '../../../../utils/types'
import { CalloutData } from '../../UPage/ublockTypes'
import { UText, _mockUTextP } from '../types'
import { Callout } from './Callout'

const T = () => {
  const [d1, sd1] = useState<CalloutData>({ text: c, type: 'error' })
  const [d2, sd2] = useState<CalloutData>({ text: c, type: 'info' })
  const [d3, sd3] = useState<CalloutData>({ text: c, type: 'warning' })
  const [d4, sd4] = useState<CalloutData>({ text: c, type: 'success' })
  const ps: UText = _mockUTextP

  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={1}>
        <Callout {...ps} data={d1} setData={(_, d) => sd1((old) => ({ ...old, ...(d as JSObject) }))} />
        <Callout {...ps} data={d2} setData={(_, d) => sd2((old) => ({ ...old, ...(d as JSObject) }))} />
        <Callout {...ps} data={d3} setData={(_, d) => sd3((old) => ({ ...old, ...(d as JSObject) }))} />
        <Callout {...ps} data={d4} setData={(_, d) => sd4((old) => ({ ...old, ...(d as JSObject) }))} />
      </Stack>
    </Box>
  )
}

const T2 = () => {
  const [d1, sd1] = useState<CalloutData>({ text: c, type: 'info' })
  return (
    <Box sx={{ width: 500 }}>
      <Callout
        {..._mockUTextP}
        data={d1}
        setData={(_, d) => sd1((old) => ({ ...old, ...(d as JSObject) }))}
        readonly={true}
      />
    </Box>
  )
}

const c =
  'Kittens are vulnerable because they like to find dark places to hide, sometimes with fatal results if they are not watched carefully.'

export const DifferentColors = T
export const Readonly = T2

export default {
  title: 'Editing extras/Callout',
}
