import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { Rec } from '../Rec'
import { ResizableColumns } from './ResizableColumns'
import { ResizableWidth } from './ResizableWidth'
import { ResizableFluidWidth } from './ResizableFluidWidth'

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

const colors = ['green', 'red', 'blue']

function T3() {
  const [widths, setWidths] = useState(['20%', '65%', '15%'])

  return (
    <Box sx={{ backgroundColor: 'black', width: '50%', height: 300 }}>
      <ResizableColumns widths={widths} updateWidths={setWidths}>
        <Rec stretch={true} height={300} color={colors[0]}>
          Try to decrease space that this text occupies
        </Rec>
        <Rec stretch={true} height={300} color={colors[1]} />
        <Rec stretch={true} height={300} color={colors[2]} />
      </ResizableColumns>
    </Box>
  )
}

function T4() {
  const [w, sw] = useState('50%')
  return (
    <Stack direction="row" justifyContent="center" sx={{ height: 300, backgroundColor: 'cyan', width: 1000 }}>
      <div>
        <ResizableFluidWidth updateWidth={sw} width={w}>
          <Rec stretch={true} height={300} />
        </ResizableFluidWidth>
      </div>
    </Stack>
  )
}

function T5() {
  const [w, sw] = useState(1000)
  return (
    <Box sx={{ height: 300, backgroundColor: 'cyan', width: w }}>
      <Stack direction="row" justifyContent="center" sx={{ height: '100%' }}>
        <ResizableWidth updateWidth={() => {}} width={1000} maxWidth={1000}>
          <Rec stretch={true} height={300} />
        </ResizableWidth>
      </Stack>
      <Button onClick={() => sw(500)}>Resize</Button>
    </Box>
  )
}

export const ResizableFromBothSides = T
export const ResizableFromRight = T2
export const ResizeColumns = T3
export const Fluid = T4
export const ResizesWhenMaxWidthIsParent100Percent = T5

export default {
  title: 'Utils/ResizableWidth',
}
