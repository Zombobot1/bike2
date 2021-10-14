import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { fn, num, setStr } from '../../../utils/types'
import { useMount } from '../../utils/hooks/hooks'
import { UBlock } from '../UBlock'

function T(props: UBlock) {
  const [f, sf] = useState(props.focus)

  return (
    <Box sx={{ width: 500 }}>
      <Button onClick={() => sf((f) => ({ ...f, type: f?.type === 'end' ? 'start' : 'end' }))}>Focus</Button>
      <UBlock
        {...props}
        focus={f}
        arrowNavigation={{ up: (x) => console.info('up ' + x ?? ''), down: (x) => console.info('down ' + x ?? '') }}
      />
    </Box>
  )
}

const data1: UBlock = {
  id: 'f-full',
  focus: { type: 'start', xOffset: 20 },
}

const readonly: UBlock = {
  ...data1,
  readonly: true,
}

const data2: UBlock = {
  id: 'newEmptyText',
  initialData: { data: '', type: 'TEXT' },
}

const data3: UBlock = {
  id: 'newEmptyHeader',
  initialData: { data: '', type: 'HEADING1' },
}

const data4: UBlock = {
  id: 'emptyString',
}

const bold: UBlock = {
  id: 'bold',
  initialData: { data: 'bold', type: 'TEXT' },
}

const transformedText: UBlock = {
  id: 'transformedText',
  initialData: {
    data: 'Example: <b>bold</b> <code>code</code> <a href="https://www.google.com/" target="_blank">link</a>',
    type: 'TEXT',
  },
}

export const SetsFocus = () => <T {...data1} />
export const ReadOnlyText = () => <T {...readonly} />
export const BoldText = () => <T {...bold} />
export const TransformedText = () => <T {...transformedText} />
export const ChangesComponents = () => <T {...data4} />
export const DisplaysPlaceholderWhenFocused = () => <T {...data2} />
export const DisplaysPlaceholderWhenUnfocused = () => <T {...data3} />

export default {
  title: 'Editing/UText',
}
