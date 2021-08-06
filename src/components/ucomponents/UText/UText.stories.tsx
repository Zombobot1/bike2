import { Box } from '@material-ui/core'
import { UBlock } from '../UBlock'

function Template(props: UBlock) {
  return (
    <Box sx={{ width: 500, backgroundColor: 'pink' }}>
      <UBlock {...props} />
    </Box>
  )
}

const data1: UBlock = {
  _id: 'data1',
}

const readonly: UBlock = {
  ...data1,
  readonly: true,
}

const data2: UBlock = {
  _id: '',
}

const data3: UBlock = {
  _id: '',
  type: 'HEADING1',
}
const data4: UBlock = {
  _id: 'data4',
}

export const UTextS = {
  EditsText: () => <Template {...data1} />,
  ReadOnlyText: () => <Template {...readonly} />,
  CreatesItself: () => <Template {...data2} />,
  ChangesComponents: () => <Template {...data4} />,
  DisplaysPlaceholderWhenFocused: () => <Template {...data2} />,
  DisplaysPlaceholderWhenUnfocused: () => <Template {...data3} />,
}
