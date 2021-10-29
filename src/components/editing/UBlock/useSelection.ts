import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import { fn, num, str, strs } from '../../../utils/types'
import { UComponentType } from '../types'

export function useSelection(type?: UComponentType) {
  const [selection, _dispatch] = useReducerAtom(selectionA, selectionR)

  return { selection, dispatch: type === 'code' ? fn : _dispatch }
}

class Selection {
  ids: strs = []
  enteredAtY = -1
  state: 'none' | 'active' | 'selected' | 'selecting-by-click' = 'none'
}

type SelectionA =
  | { a: 'select'; id: str }
  | { a: 'select-by-click'; id: str }
  | { a: 'clear' }
  | { a: 'mouse-down' }
  | { a: 'mouse-up' }
  | { a: 'mouse-enter'; atY: num; id: str }
  | { a: 'mouse-leave'; atY: num; id: str }

function selectionR(old: Selection, action: SelectionA): Selection {
  switch (action.a) {
    case 'clear':
      if (old.state === 'selecting-by-click') return { ...old, state: 'selected' }
      return { state: 'none', ids: [], enteredAtY: -1 }
    case 'select':
      window.getSelection()?.removeAllRanges()
      if (old.state === 'selecting-by-click') return { ...old, ids: [...old.ids, action.id] }
      return { state: 'selected', ids: [action.id], enteredAtY: -1 }
    case 'select-by-click': // when drag btn is clicked mouse-down and mouse-up are called before this
      return { state: 'selecting-by-click', ids: [...old.ids, action.id], enteredAtY: -1 }
    case 'mouse-down':
      if (old.state === 'selecting-by-click') return old
      return { ...old, ids: [], state: 'active', enteredAtY: -1 }
    case 'mouse-up':
      if (old.state === 'selecting-by-click') return old
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
