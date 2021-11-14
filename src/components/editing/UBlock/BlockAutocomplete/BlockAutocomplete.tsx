import { RefObject } from 'react'
import { bool, Fn } from '../../../../utils/types'
import { UMenu, UOption } from '../../../utils/UMenu/UMenu'
import { UElementsOptions } from './UElementsOptions'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'

export interface BlockAutocomplete {
  btnRef: RefObject<HTMLButtonElement | HTMLLIElement>
  isOpen: bool
  close: Fn
  context: 'general' | 'uform'
  createBlock: Fn
}

export function BlockAutocomplete({ context, btnRef, close, isOpen }: BlockAutocomplete) {
  return (
    <UMenu btnRef={btnRef} isOpen={isOpen} close={close} elevation={8} minWidth="15rem">
      <UElementsOptions context={context} />
    </UMenu>
  )
}

export function BlockTurner(props: UElementsOptions) {
  return (
    <UOption icon={AutorenewRoundedIcon} text="Turn into">
      <UElementsOptions {...props} />
    </UOption>
  )
}
