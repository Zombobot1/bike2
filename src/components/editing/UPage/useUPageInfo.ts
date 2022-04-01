import { atom, useAtom } from 'jotai'
import { bool, f, str } from '../../../utils/types'
import { useAtomTrigger } from '../../utils/hooks/useAtomTrigger'
import { UBlockData } from './ublockTypes'
import { UPageCursor, UPageStateMutation } from './UPageState/types'

const openTOCTriggerA = atom(0)
const triggerFullWidthA = atom(0)

// will include security info
export function useUPageTriggers() {
  const [openTOCTrigger, triggerOpenTOC] = useAtomTrigger(openTOCTriggerA)
  const [fullWidthTrigger, triggerFullWidth] = useAtomTrigger(triggerFullWidthA)
  const [turnOffTOCTrigger, triggerTurnOffTOC] = useAtomTrigger(triggerFullWidthA)

  return { fullWidthTrigger, triggerOpenTOC, openTOCTrigger, triggerFullWidth, turnOffTOCTrigger, triggerTurnOffTOC }
}

export const useUPageCursor = () => ({ cursor: useAtom(cursorA)[0] })
export const useSetUPageCursor = () => ({ setCursor: useAtom(cursorUpdateA)[1] })
const cursorA = atom(new UPageCursor())
const cursorUpdateA = atom(null, (_, set, update: UPageCursor) => set(cursorA, update))

class UPageInfo {
  readonly?: bool
}

export const useUPageInfo = () => ({ info: useAtom(upageInfoA)[0] })
export const useSetUPageInfo = () => ({ setUPageInfo: useAtom(setUpageInfoA)[1] })
const upageInfoA = atom(new UPageInfo())
const setUpageInfoA = atom(null, (_, set, update: UPageInfo) => set(upageInfoA, update))

// supposed to be used only in UBlock.tsx & UBlockSet.tsx
export let upage: UPageStateMutation = {
  add: f,
  rearrange: f,
  deleteSelected: f,
  createUGrid: f,
  moveTo: f,
  change: f,
  changeType: f,
  changeRuntimeData: f,
  onUTextBackspace: f,
  onUTextEnter: f,
  onUTextPaste: f,
  onUTextShiftTab: f,
  onUTextTab: f,
  onFactoryChange: f,
  onFactoryEnter: f,
  moveFocusDown: f,
  moveFocusUp: f,
  resetFocus: f,
  onDragEnd: f,
  onDragStart: f,
  select: f,
  selectAll: f,
  unselect: f,
  triggerUListOpen: f,
  handleUFormEvent: f,
  context: () => 'upage',
  _da: () => 'net',
}

declare global {
  interface Window {
    da: (id: str) => UBlockData | undefined
  }
}

typeof window !== 'undefined' && (window.da = upage._da)

export const setUPageChanger = (val: UPageStateMutation) => {
  upage = val
  typeof window !== 'undefined' && (window.da = upage._da)
}
