import { Stack } from '@mui/material'
import { useState } from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import { Children, num, SetStrs, str, strs } from '../../../utils/types'
import { useReactiveObject } from '../hooks/hooks'
import { ResizableFluidWidth } from './ResizableWidth'

export interface ResizableColumns {
  widths: strs
  children: Children
  updateWidths: SetStrs
}

export function ResizableColumns({ widths: initialWidths, updateWidths, children }: ResizableColumns) {
  const [widths, setWidths] = useReactiveObject(initialWidths)
  const [resizingI, setResizingI] = useState(-2)
  const onWidthChange = (columnI: num) => (newWidth: str) =>
    setWidths(
      widths.map((w, i) => {
        if (i === columnI) return newWidth
        if (i === columnI + 1) return toNum(w) - (toNum(newWidth) - toNum(widths[i - 1])) + '%'
        return w
      }),
    )
  const isConsistent = widths.length === initialWidths.length

  return (
    <Stack direction="row" style={{ height: '100%' }}>
      {flattenChildren(children).map((c, i) => (
        <ResizableFluidWidth
          key={i}
          updateWidth={() => {
            updateWidths(widths)
            setResizingI(-2)
          }}
          onWidthChange={onWidthChange(i)}
          onResizeStart={() => setResizingI(i)}
          width={isConsistent ? widths[i] : initialWidths[i]}
          maxWidth={getMaxWidth(isConsistent ? widths : initialWidths, i)}
          readonly={i === widths.length - 1}
          stretch={i === resizingI + 1}
        >
          {c}
        </ResizableFluidWidth>
      ))}
    </Stack>
  )
}

const toNum = (percent: str) => +percent.replace('%', '')

function getMaxWidth(widths: strs, i: num): str {
  if (i === widths.length - 1) return '100%'
  return +widths[i].replace('%', '') + +widths[i + 1].replace('%', '') - 5 + '%'
}
