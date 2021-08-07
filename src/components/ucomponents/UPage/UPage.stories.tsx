import { Box } from '@material-ui/core'
import { UBlockB } from '../types'
import { UPage } from './UPage'

function T(props: UBlockB) {
  return (
    <Box sx={{ width: 500, backgroundColor: 'pink' }}>
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

export const UPageS = {
  CreatesBlocks: () => <T {...data1} />,
  DeletesBlocks: () => <T {...data2} />,
}
