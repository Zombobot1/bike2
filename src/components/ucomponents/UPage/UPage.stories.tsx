import { Box } from '@material-ui/core'
import { OuterShell } from '../../Shell/Shell'
import { UBlockB } from '../types'
import { UPage } from './UPage'

function T(props: UBlockB) {
  return (
    <OuterShell>
      <Box sx={{ width: 500, backgroundColor: 'pink' }}>
        <UPage {...props} />
      </Box>
    </OuterShell>
  )
}

const data1: UBlockB = {
  _id: 'page1',
}

const data2: UBlockB = {
  _id: 'page2',
}

export const CreatesBlocks = () => <T {...data1} />
export const DeletesBlocks = () => <T {...data2} />

export default {
  title: 'UComponents/UPage',
  component: UPage,
}
