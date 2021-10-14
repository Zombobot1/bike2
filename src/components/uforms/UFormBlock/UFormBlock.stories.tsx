import { Box } from '@mui/material'
import { fn, setStr } from '../../../utils/types'
import { UBlock } from '../../editing/UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500, marginLeft: '1rem' }}>
      <UBlock {...props} />
    </Box>
  )
}

const input1: UBlock = {
  id: 'input1',
}

const text1: UBlock = {
  id: 'textarea1',
  initialData: { data: '', type: 'TEXTAREA' },
}

const checks1: UBlock = {
  id: 'checks1',
  initialData: { data: '', type: 'CHECKS' },
}

const radio1: UBlock = {
  id: 'radio1',
  initialData: { data: '', type: 'RADIO' },
}

export const InputEditing = () => <T {...input1} />
export const TextAreaEditing = () => <T {...text1} />
export const RadioEditing = () => <T {...radio1} />
export const ChecksEditing = () => <T {...checks1} />

export default {
  title: 'UForms/UFormBlock',
}
