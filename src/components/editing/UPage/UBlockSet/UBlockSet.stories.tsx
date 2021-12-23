import { Box } from '@mui/material'
import { useState } from 'react'
import { _kittensForFocusPage } from '../../../../content/content'
import { _oneBlockPage, _removalPage } from '../../../../content/ublocks'
import { str, strs } from '../../../../utils/types'
import { UBlocksSet } from './UBlockSet'

const T = (ids: strs, title?: str) => {
  const s = useState(ids)
  const t = useState(title ?? 'Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <UBlocksSet id="s" ids={s[0]} setIds={s[1]} readonly={false} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

export const ArrowsNavigation = () => T(_kittensForFocusPage.ids)
export const BlocksCreation = () => T([], '')
export const BlocksDeletion = () => T(_removalPage.ids)
export const OneEmptyBlock = () => T(_oneBlockPage.ids)
export const WihLatex = () => T(['fallingCatsShort1', 'fallingCatsShort2', 'fallingCatsShort3'])

export default {
  title: 'Editing/UBlocksSet',
}
