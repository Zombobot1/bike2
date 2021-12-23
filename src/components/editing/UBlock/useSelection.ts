import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import _ from 'lodash'
import { mapAppend } from '../../../utils/algorithms'
import { bool, num, str, strs } from '../../../utils/types'
import { safe } from '../../../utils/utils'

export function useSelection() {
  const [selection, dispatch] = useReducerAtom(selectionA, selectionR)
  return { selection, dispatch }
}

type SelectionA =
  | { a: 'updated'; setId: str }
  | { a: 'droppedIn'; setId: str }
  | { a: 'droppedInColumn'; setId: str }
  | { a: 'start-drag'; id: str; setId: str }
  | { a: 'end-drag' }
  | { a: 'select'; id: str; setId: str }
  | { a: 'select-by-click'; id: str; setId: str }
  | { a: 'clear'; force?: bool }
  | { a: 'mouse-down' }
  | { a: 'mouse-up' }
  | { a: 'mouse-enter'; atY: num; id: str; setId: str }
  | { a: 'mouse-leave'; atY: num; id: str }

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
      return generateUpdate({ ...old, state: 'selected', ids: [...old.draggingIds], draggingIds: [] })
    case 'droppedIn':
      return { ...old, droppedInSetId: a.setId }
    case 'droppedInColumn': {
      // end-drag is not called when columns are created
      const new_ = !old.draggingIds.length
        ? new Selection()
        : generateUpdate({ ...old, state: 'none', ids: [...old.draggingIds], draggingIds: [], droppedInSetId: a.setId })
      return { ...new_, ids: [] } // generate update but do not select any block
    }
    case 'updated': {
      const idsToUpdate = safe(old.setIdAndBlocksToDelete.get(a.setId))
      idsToUpdate.forEach((id) => old.idAndSetId.set(id, old.droppedInSetId))
      old.setIdAndBlocksToDelete.delete(a.setId)
      return { ...old }
    }
    case 'clear':
      if (old.state === 'selecting-by-click' && !a.force) return { ...old, state: 'selected' } // force when we change type
      return new Selection()
    case 'select':
      old.idAndSetId.set(a.id, a.setId)
      if (old.state === 'selecting-by-click') return { ...old, ids: [...old.ids, a.id] }
      return { ...old, state: 'selected', ids: [a.id], draggingIds: [] }
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
      enteredAtY.clear()
      upageScroll = 0
      if (old.state === 'selecting-by-click') return old
      return { ...old, state: old.ids ? 'selected' : 'none' }
    case 'mouse-enter': {
      if (old.state !== 'active') return old
      enteredAtY.set(a.id, a.atY)
      old.idAndSetId.set(a.id, a.setId)
      return { ...old, ids: [...old.ids, a.id] }
    }
    case 'mouse-leave': {
      if (old.state !== 'active') return old

      let ids = old.ids
      if (a.atY + upageScroll <= (enteredAtY.get(a.id) || 0 + upageScroll) + 10) {
        ids = ids.filter((id) => id !== a.id)
      }

      return { ...old, ids }
    }
  }
}

class Selection {
  ids: strs = []
  draggingIds: strs = []
  idAndSetId: Map<str, str> = new Map()
  droppedInSetId = ''
  setIdAndBlocksToDelete: Map<str, strs> = new Map()
  state: 'dragging' | 'none' | 'active' | 'selected' | 'selecting-by-click' = 'none'
}

function generateUpdate(selection: Selection): Selection {
  if (!selection.droppedInSetId) return selection // start drag and stop it
  selection.ids.forEach((id) => {
    const setId = selection.idAndSetId.get(id)
    if (setId !== selection.droppedInSetId) {
      mapAppend(selection.setIdAndBlocksToDelete, setId, id)
    }
  })
  return selection
}

const enteredAtY: Map<str, num> = new Map()

const selectionA = atom(new Selection())

let upageScroll = 0

export const setUPageScroll = (new_: num) => {
  upageScroll = new_
}
