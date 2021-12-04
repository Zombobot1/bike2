import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { Rec } from '../Rec'
import { ResizableWidth } from './ResizableWidth'

function T() {
  return (
    <Stack direction="row" justifyContent="center" sx={{ height: 300, backgroundColor: 'cyan', width: 1000 }}>
      <ResizableWidth updateWidth={() => {}} width={600} maxWidth={1000}>
        <Rec stretch={true} height={300} />
      </ResizableWidth>
    </Stack>
  )
}

function T2() {
  const [w, sw] = useState(600)
  return (
    <Box sx={{ height: 300, backgroundColor: 'cyan', width: 600 }}>
      <ResizableWidth updateWidth={sw} width={w} maxWidth={600} rightOnly={true} hiddenHandler={true}>
        <Rec stretch={true} height={300} />
      </ResizableWidth>
      {w}
    </Box>
  )
}

export const ResizableFromBothSides = T
export const ResizableFromRight = T2

export default {
  title: 'Utils/ResizableWidth',
}
