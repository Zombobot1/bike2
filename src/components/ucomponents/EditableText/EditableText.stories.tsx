import { Box } from '@material-ui/core'
import { StrBlock } from '../StrBlock'

function Template(props: StrBlock) {
  return (
    <Box sx={{ width: 500, backgroundColor: 'pink' }}>
      <StrBlock {...props} />
    </Box>
  )
}

const data1: StrBlock = {
  _id: 'data1',
}

const readonly: StrBlock = {
  ...data1,
  readonly: true,
}

const data2: StrBlock = {
  _id: '',
}

const data3: StrBlock = {
  _id: '',
  type: 'HEADING1',
}

export const UTextS = {
  EditsText: () => <Template {...data1} />,
  ReadOnlyText: () => <Template {...readonly} />,
  ChangesComponents: () => <Template {...data2} />,
  DisplaysPlaceholderWhenFocused: () => <Template {...data2} />,
  DisplaysPlaceholderWhenUnfocused: () => <Template {...data3} />,
}
