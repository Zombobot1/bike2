import { Box } from '@material-ui/core'
import { fn, setStr } from '../../../utils/types'
import { UBlock } from '../../ucomponents/UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500, marginLeft: '1rem' }}>
      <UBlock {...props} />
    </Box>
  )
}

const t: UBlock = {
  _id: '',
  type: 'INPUT',
  addNewBlock: fn,
  deleteBlock: setStr,
  isEditing: true,
}

const input1: UBlock = {
  ...t,
  _id: 'input1',
}

const text1: UBlock = {
  ...t,
  _id: 'textarea1',
  type: 'TEXTAREA',
}

const checks1: UBlock = {
  ...t,
  _id: 'checks1',
  type: 'CHECKS',
}

const radio1: UBlock = {
  ...t,
  _id: 'radio1',
  type: 'RADIO',
}

export const InputEditing = () => <T {...input1} />
export const TextAreaEditing = () => <T {...text1} />
export const RadioEditing = () => <T {...radio1} />
export const ChecksEditing = () => <T {...checks1} />

export default {
  title: 'UForm/UFormBlock',
  component: UBlock,
}
