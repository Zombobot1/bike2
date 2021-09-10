import { Box } from '@material-ui/core'
import { fn, setStr } from '../../../utils/types'
import { UBlock } from '../UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const t: UBlock = {
  id: '',
  addNewBlock: fn,
  deleteBlock: setStr,
}

const data1: UBlock = {
  ...t,
  id: 'data1',
}

const readonly: UBlock = {
  ...data1,
  readonly: true,
}

const data2: UBlock = {
  ...t,
  id: '',
}

const data3: UBlock = {
  ...t,
  id: '',
  // type: 'HEADING1',
}

const data4: UBlock = {
  ...t,
  id: 'data4',
}

export const EditsText = () => <T {...data1} />
export const ReadOnlyText = () => <T {...readonly} />
export const ChangesComponents = () => <T {...data4} />
export const DisplaysPlaceholderWhenFocused = () => <T {...data2} />
export const DisplaysPlaceholderWhenUnfocused = () => <T {...data3} />

export default {
  title: 'Editing/UText',
}
