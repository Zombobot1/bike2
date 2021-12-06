import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import _ from 'lodash'
import { bool, num, str, strs } from '../../../utils/types'

export function useSelection() {
  const [selection, dispatch] = useReducerAtom(selectionA, selectionR)
  return { selection, dispatch }
}

type SelectionA =
  | { a: 'start-drag'; id: str }
  | { a: 'start-drag'; id: str }
  | { a: 'end-drag' }
  | { a: 'select'; id: str }
  | { a: 'select-by-click'; id: str }
  | { a: 'clear'; force?: bool }
  | { a: 'mouse-down' }
  | { a: 'mouse-up' }
  | { a: 'mouse-enter'; atY: num; id: str }
  | { a: 'mouse-leave'; atY: num; id: str }

function selectionR(old: Selection, action: SelectionA): Selection {
  switch (action.a) {
    case 'start-drag': {
      const draggingIds = [...old.ids]
      if (!old.ids.includes(action.id)) draggingIds.push(action.id)
      return { state: 'dragging', ids: [], draggingIds }
    }
    case 'end-drag':
      if (!old.draggingIds.length) return new Selection()
      return { state: 'selected', ids: [...old.draggingIds], draggingIds: [] }
    case 'clear':
      if (old.state === 'selecting-by-click' && !action.force) return { ...old, state: 'selected' } // force when we change type
      return new Selection()
    case 'select':
      if (old.state === 'selecting-by-click') return { ...old, ids: [...old.ids, action.id] }
      return { state: 'selected', ids: [action.id], draggingIds: [] }
    case 'select-by-click': {
      // when drag btn is clicked mouse-down and mouse-up start-drag are called before this
      if (old.state === 'dragging')
        return { ...old, state: 'selecting-by-click', ids: _.uniq([...old.ids, action.id, ...old.draggingIds]) }
      else return { state: 'selecting-by-click', ids: [...old.ids, action.id], draggingIds: [] }
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
      enteredAtY.set(action.id, action.atY)
      return { ...old, ids: [...old.ids, action.id] }
    }
    case 'mouse-leave': {
      if (old.state !== 'active') return old

      let ids = old.ids
      if (action.atY + upageScroll <= (enteredAtY.get(action.id) || 0 + upageScroll) + 10) {
        ids = ids.filter((id) => id !== action.id)
      }

      return { ...old, ids }
    }
  }
}

class Selection {
  ids: strs = []
  draggingIds: strs = []
  state: 'dragging' | 'none' | 'active' | 'selected' | 'selecting-by-click' = 'none'
}

const enteredAtY: Map<str, num> = new Map()

const selectionA = atom(new Selection())

let upageScroll = 0

export const setUPageScroll = (new_: num) => {
  upageScroll = new_
}
