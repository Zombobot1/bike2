import { Box } from '@mui/material'
import { useState } from 'react'
import { _kittensForFocusPage } from '../../../content/content'
import { _oneBlockPage, _removalPage } from '../../../content/ublocks'
import { str, strs } from '../../../utils/types'
import { SetForStories } from './SetForStories'

const T = (ids: strs, title?: str) => {
  const s = useState(ids)
  const t = useState(title ?? 'Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories id="s" ids={s[0]} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

export const ArrowsNavigation = () => T(_kittensForFocusPage.ids)
export const BlocksCreation = () => T([], '')
export const BlocksDeletion = () => T(_removalPage.ids)
export const OneEmptyBlock = () => T(_oneBlockPage.ids)
export const WihLatex = () => T(['fallingCatsShort1', 'fallingCatsShort3'])

export default {
  title: 'Editing/UBlocksSet',
}
