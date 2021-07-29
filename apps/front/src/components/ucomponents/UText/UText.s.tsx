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

const idless: StrBlock = {
  _id: '',
}

export const EditsText = () => <Template {...data1} />
export const ReadOnlyText = () => <Template {...readonly} />
export const ChangesComponents = () => <Template {...data2} />
export const DisplaysPlaceholderWhenFocused = () => <Template {...data2} />
export const DisplaysPlaceholderWhenUnfocused = () => <Template {...data3} />
export const CreatesItself = () => <Template {...idless} />
export const UpdatesData = () => <Template {...data1} />
export const UpdatesType = () => <Template {...data1} />
