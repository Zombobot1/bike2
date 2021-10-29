import { Box, Stack } from '@mui/material'
import { str } from '../../../../utils/types'
import { UBlock } from '../../UBlock/UBlock'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <Stack spacing={1}>
        <UBlock {...data1} />
        <UBlock {...data2} />
        <UBlock {...data3} />
        <UBlock {...data4} />
      </Stack>
    </Box>
  )
}

const T2 = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...readonly} />
    </Box>
  )
}

const c =
  'Kittens are vulnerable because they like to find dark places to hide, sometimes with fatal results if they are not watched carefully.'
const d = (type: str) =>
  JSON.stringify({
    type,
    text: c,
  })

const data1: UBlock = {
  id: 'callout1',
  initialData: { data: d('info'), type: 'callout' },
}

const data2: UBlock = {
  id: 'callout2',
  initialData: { data: d('success'), type: 'callout' },
}

const data3: UBlock = {
  id: 'callout3',
  initialData: { data: d('warning'), type: 'callout' },
}

const data4: UBlock = {
  id: 'callout4',
  initialData: { data: d('error'), type: 'callout' },
}

const readonly: UBlock = {
  id: 'readonly-callout1',
  initialData: { data: d('info'), type: 'callout' },
  readonly: true,
}

export const DifferentColors = T
export const Readonly = T2

export default {
  title: 'Editing/Callout',
}
