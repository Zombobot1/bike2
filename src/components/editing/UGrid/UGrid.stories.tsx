import { Box } from '@mui/material'
import { _blocks } from '../../../content/blocks'
import { SetForStories } from '../UPage/UBlockSet/SetForStories'
import { UBlocks } from '../UPage/ublockTypes'
import { _generators } from '../UPage/UPageState/crdtParser/_fakeUPage'

const { t, grid } = _generators

const forBuilding = [
  _blocks.test.bathYourCat,
  t('Gather your supplies'),
  t('Rinse your cat'),
  _blocks.test.whyOwnCat,
  t('Cats can bathe themselves'),
  t('Cats will keep your house and yard rodent-free'),
]

const blocks = [grid([forBuilding.slice(0, 3), forBuilding.slice(3)], ['50%', '50%'])]

const T = (blocks: UBlocks) => {
  return (
    <Box sx={{ width: '70%' }}>
      <SetForStories blocks={blocks} />
    </Box>
  )
}

export const AddsAndDeletesBlocks = () => T(blocks)
export const BuildColumns = () => T(forBuilding)

export default {
  title: 'Editing extras/UGrid',
}
