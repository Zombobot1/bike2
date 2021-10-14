import { Stack } from '@mui/material'
import { Rec } from '../Rec'
import { ResizableWidth } from './ResizableWidth'

function T() {
  return (
    <Stack direction="row" justifyContent="center" sx={{ height: 300 }}>
      <ResizableWidth updateWidth={() => {}} width={600}>
        <Rec stretch={true} height={300} />
      </ResizableWidth>
    </Stack>
  )
}

export const ResizableFromBothSides = T

export default {
  title: 'Utils/ResizableWidth',
}
