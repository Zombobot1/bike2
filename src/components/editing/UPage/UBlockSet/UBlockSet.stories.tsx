import { Box } from '@mui/material'
import { useState } from 'react'
import { _blocks } from '../../../../content/blocks'
import { str } from '../../../../utils/types'
import { UBlocks } from '../ublockTypes'
import { _generators } from '../UPageState/crdtParser/_fakeUPage'
import { SetForStories } from './SetForStories'
const { t } = _generators
const T = (blocks: UBlocks, title?: str) => {
  const t = useState(title ?? 'Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories blocks={blocks} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

const _kittensForFocusPage = [
  _blocks.test.kittensHL,
  _blocks.test.kittensS,
  _blocks.test.newCatFile,
  _blocks.test.kittensH2L,
  _blocks.test.kittens2S,
  _blocks.test.kittens3S,
  _blocks.test.kittensH3L,
  _blocks.test.fatCode,
  _blocks.test.kittens4S,
]

const _removalPage = [t('cat'), t(''), t('d'), _blocks.pets.fluffyImg]

export const ArrowsNavigation = () => T(_kittensForFocusPage)
export const BlocksCreation = () => T([], '')
export const BlocksDeletion = () => T(_removalPage)
export const OneEmptyBlock = () => T([t()])
export const WihLatex = () => T([_blocks.test.fallingCatsShort1, _blocks.test.fallingCatsShort3])
export const Other = () => T([t('0'), t('ab'), t('2')])

export default {
  title: 'Editing core/UBlocksSet',
}
