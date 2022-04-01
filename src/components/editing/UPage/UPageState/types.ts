import { immerable } from 'immer'
import { Fn, num, str, strs } from '../../../../utils/types'
import { FocusType, UPageFocus } from '../../types'
import { UBlockType, UBlockContext, UBlockData } from '../ublockTypes'
import { UFormEvent } from './crdtParser/UPageRuntimeTree'

export interface TOC {
  id: str
  type: UBlockType
  data: str
}
export type TOCs = TOC[]

export class UPageCursor {
  [immerable] = true

  focus?: UPageFocus
  selected = [] as strs
  isDragging = false
}

interface UPageCursorMutation {
  moveFocusUp: (id?: str, xOffset?: num) => void
  moveFocusDown: (id?: str, xOffset?: num) => void
  resetFocus: Fn

  select: (...ids: strs) => void
  selectAll: Fn
  unselect: Fn
  onDragStart: Fn
  onDragEnd: Fn
}

interface BlocksManagement {
  rearrange: (underId?: str) => void
  add: (underId: str, type?: UBlockType) => void
  deleteSelected: (o?: { moveTo?: str }) => void
  createUGrid: (id: str, side: 'right' | 'left') => void
  moveTo: (pageId: str) => void
}

interface UPageStateLookup {
  context: (id: str) => UBlockContext
}

interface UTextEventHandlers {
  onUTextTab: (id: str, data: str) => void
  onUTextShiftTab: (id: str, data: str) => void
  onUTextBackspace: (id: str, data: str) => void
  onUTextEnter: (dataAbove: str, dataBelow: str, underId: str) => void
  onUTextPaste: (data: str, underId: str, type?: UBlockType) => void

  onFactoryChange: (data: str, type: UBlockType, parentId?: str) => void
  onFactoryEnter: (parentId?: str) => void
}

export interface UPageStateMutation
  extends UPageCursorMutation,
    BlocksManagement,
    UPageStateLookup,
    UTextEventHandlers {
  change: (id: str, newData: Partial<UBlockData>) => void
  changeType: (id: str, type: UBlockType, data?: str, focus?: FocusType) => void
  changeRuntimeData: (changes: [str, UBlockData][]) => void

  triggerUListOpen: (id: str) => void
  handleUFormEvent: (uformId: str, e: UFormEvent) => void

  _da: (id: str) => UBlockData | undefined
}
