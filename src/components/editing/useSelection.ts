import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import { num, str, strs } from '../../utils/types'

export function useSelection() {
  const [selection, dispatch] = useReducerAtom(selectionA, selectionR)
  return { selection, dispatch }
}

class Selection {
  ids: strs = []
  enteredAtY = -1
  state: 'none' | 'active' | 'selected' = 'none'
}

type SelectionA =
  | { a: 'select'; id: str }
  | { a: 'clear' }
  | { a: 'mouse-down' }
  | { a: 'mouse-up' }
  | { a: 'mouse-enter'; atY: num; id: str }
  | { a: 'mouse-leave'; atY: num; id: str }

function selectionR(old: Selection, action: SelectionA): Selection {
  switch (action.a) {
    case 'clear':
      return { state: 'none', ids: [], enteredAtY: -1 }
    case 'select':
      window.getSelection()?.removeAllRanges()
      return { state: 'selected', ids: [action.id], enteredAtY: -1 }
    case 'mouse-down':
      return { ...old, ids: [], state: 'active', enteredAtY: -1 }
    case 'mouse-up':
      return { ...old, state: old.ids ? 'selected' : 'none' }
    case 'mouse-enter': {
      if (old.state !== 'active') return old
      loseFocus()

      return { ...old, ids: [...old.ids, action.id], enteredAtY: action.atY }
    }
    case 'mouse-leave': {
      if (old.state !== 'active') return old

      let ids = old.ids
      if (old.enteredAtY === -1) ids = [...ids, action.id]
      if (old.enteredAtY > action.atY) ids = ids.filter((id) => id === action.id)

      return { ...old, ids }
    }
  }
}

function loseFocus() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(document.activeElement as any)?.blur()
  window.getSelection()?.removeAllRanges()
}

const selectionA = atom(new Selection())
