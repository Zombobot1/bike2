import _ from 'lodash'
import { mapAppend } from '../../../../utils/algorithms'
import { bool, num, str, strs } from '../../../../utils/types'
import { safe } from '../../../../utils/utils'
import { useMount } from '../../../utils/hooks/hooks'
import { UBlockSetUpdate } from '../../types'
import { getAllUBlocksForSelection, getSelectedData, getUBlockInfo } from '../blockIdAndInfo'
import { useReducerAtom } from 'jotai/utils'
import { atom } from 'jotai'
import { useUPageFocus } from './useUPageFocus'
import { isUTextBlock } from '../types'

export function useUPageSelection() {
  const { activeBlock, focusD } = useUPageFocus()
  const [selection, selectionD] = useReducerAtom(selectionA, updateCurrent(selectionR))

  useMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!currentSelection.ids.length) return
      if (e.key === 'Enter') {
        e.preventDefault() // otherwise new block will contain div with br
        e.stopImmediatePropagation()
        const type = getUBlockInfo(currentSelection.ids[0])?.type
        if (isUTextBlock(type)) {
          focusD({ a: 'focus-last-selected' })
          selectionD({ a: 'clear' })
        } else selectionD({ a: 'insert-under-selected' })
      } else if (e.key === 'Backspace') {
        selectionD({ a: 'delete-selected' })
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        navigator.clipboard.writeText(getSelectedData(currentSelection.ids))
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        selectionD({ a: 'select-all', blocks: getAllUBlocksForSelection() })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return { selection, selectionD, activeBlock, focusD }
}

type SelectionA =
  | { a: 'start-drag'; id: str; setId: str }
  | { a: 'end-drag' }
  | { a: 'select-by-click'; id: str; setId: str }
  | { a: 'mouse-down' }
  | { a: 'mouse-up' }
  | { a: 'mouse-enter'; atY: num; id: str; setId: str }
  | { a: 'mouse-leave'; atY: num; id: str }
  | { a: 'clear'; force?: bool }
  | { a: 'select'; id: str; setId: str }
  | { a: 'handle-drop-in'; setId: str }
  | { a: 'handle-drop-in-column'; columnId: str }
  | { a: 'insert-under-selected' }
  | { a: 'delete-selected' }
  | { a: 'select-all'; blocks: { id: str; setId: str }[] }
  | { a: 'applied-update'; setId: str }

export type UPageSelectionD = (a: SelectionA) => void

type R = (old: Selection, a: SelectionA) => Selection

function selectionR(old: Selection, a: SelectionA): Selection {
  switch (a.a) {
    case 'start-drag': {
      const draggingIds = [...old.ids]
      if (!old.ids.includes(a.id)) {
        draggingIds.push(a.id)
        old.idAndSetId.set(a.id, a.setId)
      }
      return { ...old, state: 'dragging', ids: [], draggingIds }
    }
    case 'end-drag':
      if (!old.draggingIds.length) return new Selection()
      return moveBlocksToNewParents({ ...old, state: 'selected', ids: [...old.draggingIds], draggingIds: [] })
    case 'handle-drop-in':
      return { ...old, droppedInSetId: a.setId }
    case 'handle-drop-in-column': {
      // end-drag is not called when columns are created
      const new_ = !old.draggingIds.length
        ? new Selection()
        : moveBlocksToNewParents({
            ...old,
            state: 'none',
            ids: [...old.draggingIds],
            draggingIds: [],
            droppedInSetId: a.columnId,
          })
      return { ...new_, ids: [] } // generate update but do not select any block
    }
    case 'clear':
      if (old.state === 'selecting-by-click' && !a.force) return { ...old, state: 'selected' } // force when we change type
      return new Selection()
    case 'select':
      old.idAndSetId.set(a.id, a.setId)
      if (old.state === 'selecting-by-click') return { ...old, ids: [...old.ids, a.id] }
      return { ...old, state: 'selected', ids: [a.id], draggingIds: [] }
    case 'select-all': {
      a.blocks.forEach(({ id, setId }) => old.idAndSetId.set(id, setId))
      const ids = a.blocks.map(({ id }) => id)
      return { ...old, state: 'selected', ids, draggingIds: [] }
    }
    case 'select-by-click': {
      old.idAndSetId.set(a.id, a.setId)
      // when drag btn is clicked mouse-down and mouse-up start-drag are called before this
      if (old.state === 'dragging')
        return { ...old, state: 'selecting-by-click', ids: _.uniq([...old.ids, a.id, ...old.draggingIds]) }
      else return { ...old, state: 'selecting-by-click', ids: [...old.ids, a.id], draggingIds: [] }
    }
    case 'mouse-down':
      if (old.state === 'dragging') return old
      if (old.state === 'selecting-by-click') return { ...old, state: 'selected' }
      return { ...old, ids: [], state: 'active' }
    case 'mouse-up':
      old.enteredAtY.clear()
      upageScroll = 0
      if (old.state === 'selecting-by-click') return old
      return { ...old, state: old.ids ? 'selected' : 'none' }
    case 'mouse-enter': {
      if (old.state !== 'active') return old
      old.enteredAtY.set(a.id, a.atY)
      old.idAndSetId.set(a.id, a.setId)
      return { ...old, ids: [...old.ids, a.id] }
    }
    case 'mouse-leave': {
      if (old.state !== 'active') return old

      let ids = old.ids
      if (a.atY + upageScroll <= (old.enteredAtY.get(a.id) || 0 + upageScroll) + 10) {
        ids = ids.filter((id) => id !== a.id)
      }

      return { ...old, ids }
    }
    case 'delete-selected':
      return deleteSelected(old)
    case 'insert-under-selected':
      return insertUnderSelected(old)
    case 'applied-update':
      return { ...old, updates: old.updates.filter((u) => u.id !== a.setId) }
  }
}

class Selection {
  ids: strs = []
  draggingIds: strs = []
  idAndSetId: Map<str, str> = new Map()
  droppedInSetId = ''
  updates = [] as UBlockSetUpdate[]
  enteredAtY: Map<str, num> = new Map()
  state: 'dragging' | 'none' | 'active' | 'selected' | 'selecting-by-click' = 'none'
}

const selectionA = atom(new Selection())

function moveBlocksToNewParents(selection: Selection): Selection {
  if (!selection.droppedInSetId) return selection // when drag is started and immediately stopped

  const setIdAndBlocksToDelete: Map<str, strs> = new Map()

  selection.ids.forEach((id) => {
    const setId = selection.idAndSetId.get(id)
    if (setId !== selection.droppedInSetId) {
      mapAppend(setIdAndBlocksToDelete, setId, id)
      selection.idAndSetId.set(id, selection.droppedInSetId)
    }
  })

  setIdAndBlocksToDelete.forEach((toDelete, id) => selection.updates.push({ id, toDelete }))
  return selection
}

function deleteSelected(selection: Selection): Selection {
  const setIdAndBlocksToDelete: Map<str, strs> = new Map()

  selection.ids.forEach((id) => {
    const setId = selection.idAndSetId.get(id)
    mapAppend(setIdAndBlocksToDelete, setId, id)
  })

  const r = new Selection()
  setIdAndBlocksToDelete.forEach((toDelete, id) => r.updates.push({ id, toDelete, deletePermanently: true }))

  return r // clear
}

function insertUnderSelected(selection: Selection): Selection {
  const r = new Selection()
  if (selection.ids.length) {
    const id = safe(selection.ids.at(-1))
    r.updates.push({ id: safe(selection.idAndSetId.get(id)), toInsert: [id] })
  }
  return r // clear
}

// it is called often, made to avoid any react rerender triggers
let upageScroll = 0
export const setUPageScroll = (new_: num) => (upageScroll = new_)

function updateCurrent(reducer: R): R {
  return (old, a) => {
    const new_ = reducer(old, a)
    currentSelection.ids = new_.ids
    currentSelection.draggingIds = new_.draggingIds
    return new_
  }
}

// made for easy read only access in other reducers
export const currentSelection = {
  ids: [] as strs,
  draggingIds: [] as strs,
}
