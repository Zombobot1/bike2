import { Box } from '@material-ui/core'
import { UBlockB } from '../types'
import { UPage } from './UPage'

function T(props: UBlockB) {
  return (
    <Box sx={{ width: 500, backgroundColor: '#cff1e6' }}>
      <UPage {...props} />
    </Box>
  )
}

const data1: UBlockB = {
  _id: 'page1',
}

const data2: UBlockB = {
  _id: 'page2',
}

const data3: UBlockB = {
  _id: 'page3',
  readonly: true,
}

export const CreatesBlocks = () => <T {...data1} />
export const DeletesBlocks = () => <T {...data2} />
export const Readonly = () => <T {...data3} />

export default {
  title: 'Editing/UPage',
  component: UPage,
}
