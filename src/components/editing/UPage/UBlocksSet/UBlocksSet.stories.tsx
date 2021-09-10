import { Box } from '@material-ui/core'
import { UBlockB } from '../../types'
import { UBlocksSet, useUBlocks } from './UBlocksSet'

function T(props: UBlockB) {
  const { idsS } = useUBlocks(props.id)
  return (
    <Box sx={{ width: 500, backgroundColor: '#cff1e6' }}>
      <UBlocksSet {...props} idsS={idsS} readonly={false} />
    </Box>
  )
}

const data1: UBlockB = {
  id: 'emptyPage',
}

const data2: UBlockB = {
  id: 'page2',
}

const data3: UBlockB = {
  id: 'page3',
  readonly: true,
}

export const CreatesBlocks = () => <T {...data1} />
export const DeletesBlocks = () => <T {...data2} />
export const Readonly = () => <T {...data3} />

export default {
  title: 'Editing/UBlocksSet',
}
