import { Box } from '@mui/material'
import { _blocks } from '../../../../content/blocks'
import { _generators } from '../UPageState/crdtParser/_fakeUPage'
import { SetForStories } from '../UBlockSet/SetForStories'
import { UPageBlockData } from '../ublockTypes'
import { UPageBlock } from './UPageBlock'
import { f } from '../../../../utils/types'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UPageBlock data={fullData} id="" handleMoveBlocksTo={f} setData={f} type="page" />
    </Box>
  )
}

const T2 = () => {
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories blocks={[b('', data, 'page'), _blocks.test.kittensS, _blocks.test.kittensH2L]} />
    </Box>
  )
}

const data: UPageBlockData = { id: 'how-pets-changed-humanity' }
const fullData: UPageBlockData = { id: 'how-pets-changed-humanity', $name: 'How pets changed humanity' }

const { b } = _generators

export const Default = T
export const MoveBlocksByDrop = T2

export default {
  title: 'Editing extras/UPageBlock',
}
