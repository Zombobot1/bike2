import { num } from '../../../../../utils/types'
import { UMenuControlsB } from '../../../../utils/UMenu/UMenu'
import { ublocksFor, ublockTypeFrom } from './BlockAutocompleteOptions'
import { LongMenu, useControlledLongMenu } from '../../../../utils/UMenu/LongMenu'
import { Box } from '@mui/material'
import { UBlockType } from '../../ublockTypes'

export interface BlockAutocomplete {
  coordinates: { b: num; x: num }
  menu: UMenuControlsB
  context: 'upage' | 'uform' | 'ucard'
  createBlock: (t: UBlockType) => void
}

export function BlockAutocomplete({ coordinates, menu, context, createBlock }: BlockAutocomplete) {
  const ps = useControlledLongMenu(menu, ublocksFor(context), '', (t) => createBlock(ublockTypeFrom(t)), {
    doNotMemorizeSelection: true,
  })

  if (!ps.isOpen) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        top: coordinates.b,
        left: coordinates.x,
        zIndex: 2, // otherwise overlapped by file dropzone
      }}
      data-cy="block-autocomplete"
    >
      <LongMenu {...ps} placeholder="block" elevation={8} maxHeight={3 * 7.3 + 'rem'} />
    </Box>
  )
}
