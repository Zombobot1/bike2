import { Box, ClickAwayListener } from '@mui/material'
import { useState } from 'react'
import { _idsForBuildColumns } from '../../../content/content'
import { mockUblock, UBlock } from '../UBlock/UBlock'
import { useSelection } from '../UBlock/useSelection'
import { UBlocksSet } from '../UPage/UBlockSet/UBlockSet'

function T() {
  const { dispatch } = useSelection()
  return (
    <ClickAwayListener onClickAway={() => dispatch({ a: 'clear' })}>
      <Box sx={{ width: '70%' }}>
        <UBlock {...mockUblock} id="cat-lists-columns" />
      </Box>
    </ClickAwayListener>
  )
}

function T2() {
  const { dispatch } = useSelection()
  const [ids, setIds] = useState(_idsForBuildColumns)
  return (
    <ClickAwayListener onClickAway={() => dispatch({ a: 'clear' })}>
      <Box sx={{ width: '70%' }}>
        <UBlocksSet id="" ids={ids} setIds={setIds} />
      </Box>
    </ClickAwayListener>
  )
}

export const AddsAndDeletesBlocks = T
export const BuildColumns = T2

export default {
  title: 'Editing/UGrid',
}
