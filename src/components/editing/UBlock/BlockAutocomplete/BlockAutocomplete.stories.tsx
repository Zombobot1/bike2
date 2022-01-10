import { Box, Button } from '@mui/material'
import { useRef, useState } from 'react'
import { _removalPage } from '../../../../content/ublocks'
import { fn } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { UMenu, useMenu } from '../../../utils/UMenu/UMenu'
import { useMenuB } from '../../../utils/UMenu/useMenuB'
import { SetForStories } from '../../UBlockSet/SetForStories'
import { BlockAutocomplete } from './BlockAutocomplete'
import { BlockTurner } from './BlockTurner'

function TTurner() {
  const ref = useRef<HTMLButtonElement>(null)
  const { open, close, toggleOpen, isOpen } = useMenu()
  useMount(open)

  return (
    <>
      <Button ref={ref} onClick={toggleOpen}>
        Toggle
      </Button>
      <UMenu btnRef={ref} close={close} isOpen={isOpen} elevation={8} hasNested={true}>
        <BlockTurner turnInto={fn} />
      </UMenu>
    </>
  )
}

const T = (context: 'general' | 'uform') => () => {
  const menu = useMenuB()

  useMount(menu.open)

  return (
    <Box sx={{ position: 'relative' }}>
      <Button onClick={menu.toggleOpen}>Toggle</Button>
      <BlockAutocomplete coordinates={{ x: 0, b: 0 }} context={context} menu={menu} createBlock={fn} />
    </Box>
  )
}

const Blocks = () => {
  const s = useState(_removalPage.ids)
  const t = useState('Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories id="a" ids={s[0]} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

export const Turner = TTurner
export const GeneralAutocomplete = T('general')
export const UFormAutocomplete = T('uform')
export const AutocompleteCompletes = Blocks

export default {
  title: 'Editing/BlockAutocomplete',
}
