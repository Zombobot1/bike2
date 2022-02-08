import { useState } from 'react'
import { f } from '../../../utils/types'
import { all as call } from '../../../utils/utils'
import { UMenuControlsB } from './UMenu'

// was moved here due to broken HMR from UMenu.tsx - didn't help
export function useMenuB(onOpen = f, onClose: (s?: 'enter' | 'esc') => void = f): UMenuControlsB {
  const [isOpen, setOpen] = useState(false)
  const open = call(onOpen, () => setOpen(true))
  const close = (success: 'enter' | 'esc' = 'enter') => {
    onClose(success)
    setOpen(false)
  }
  const toggleOpen = () => setOpen((old) => !old)
  return { isOpen, open, close, toggleOpen }
}
