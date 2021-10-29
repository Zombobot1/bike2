import { Button } from '@mui/material'
import { useRef } from 'react'
import { fn } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { UMenu, useMenu } from '../../../utils/UMenu/UMenu'
import { BlockAutocomplete, BlockTurner } from './BlockAutocomplete'
import { UElementsOptions } from './UElementsOptions'

function Turner() {
  const ref = useRef<HTMLButtonElement>(null)
  const { open, close, toggleOpen, isOpen } = useMenu()
  useMount(open)
  return (
    <>
      <Button ref={ref} onClick={toggleOpen}>
        Toggle
      </Button>
      <UMenu btnRef={ref} close={close} isOpen={isOpen} elevation={8}>
        <BlockTurner context="general" />
      </UMenu>
    </>
  )
}

function T() {
  const ref = useRef<HTMLButtonElement>(null)
  const { open, close, toggleOpen, isOpen } = useMenu()
  useMount(open)
  return (
    <>
      <Button ref={ref} onClick={toggleOpen}>
        Toggle
      </Button>
      <BlockAutocomplete btnRef={ref} context="general" close={close} isOpen={isOpen} createBlock={fn} />
    </>
  )
}

export const GeneralTurner = Turner
export const GeneralAutocomplete = T

export default {
  title: 'Editing/BlockAutocomplete',
}
