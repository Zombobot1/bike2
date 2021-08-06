import { Box } from '@material-ui/core'
import { UBlock } from '../../ucomponents/UBlock'

function Template(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const input1: UBlock = {
  _id: 'input1',
  type: 'INPUT',
  isEditing: true,
}

const text1: UBlock = {
  _id: 'textarea1',
  type: 'TEXTAREA',
  isEditing: true,
}

const checks1: UBlock = {
  _id: 'checks1',
  type: 'CHECKS',
  isEditing: true,
}

const radio1: UBlock = {
  _id: 'radio1',
  type: 'RADIO',
  isEditing: true,
}

export const UFormBlockS = {
  InputEditing: () => <Template {...input1} />,
  TextAreaEditing: () => <Template {...text1} />,
  RadioEditing: () => <Template {...radio1} />,
  ChecksEditing: () => <Template {...checks1} />,
}
