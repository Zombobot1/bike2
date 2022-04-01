import { Box, Button } from '@mui/material'
import { useRef, useState } from 'react'
import { _blocks } from '../../../../../content/blocks'
import { f } from '../../../../../utils/types'
import { useMount } from '../../../../utils/hooks/hooks'
import { UMenu, useMenu } from '../../../../utils/UMenu/UMenu'
import { useMenuB } from '../../../../utils/UMenu/useMenuB'
import { SetForStories } from '../../UBlockSet/SetForStories'
import { _generators } from '../../UPageState/crdtParser/_fakeUPage'
import { BlockAutocomplete } from './BlockAutocomplete'
import { BlockTurner } from './BlockTurner'

const { t } = _generators

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
        <BlockTurner turnInto={f} />
      </UMenu>
    </>
  )
}

const T = (context: 'upage' | 'uform') => () => {
  const menu = useMenuB()

  useMount(menu.open)

  return (
    <Box sx={{ position: 'relative' }}>
      <Button onClick={menu.toggleOpen}>Toggle</Button>
      <BlockAutocomplete coordinates={{ x: 0, b: 0 }} context={context} menu={menu} createBlock={f} />
    </Box>
  )
}
const _removalPage = [t('cat'), t(), t('d'), _blocks.pets.fluffyImg]
const Blocks = () => {
  const t = useState('Pets & Animals')
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories blocks={_removalPage} title={t[0]} setTitle={t[1]} />
    </Box>
  )
}

export const Turner = TTurner
export const UPageAutocomplete = T('upage')
export const UFormAutocomplete = T('uform')
export const AutocompleteCompletes = Blocks

export default {
  title: 'Editing core/BlockAutocomplete',
}
