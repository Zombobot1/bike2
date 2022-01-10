import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import { num, str } from '../../../../utils/types'
import { log } from '../../../../utils/utils'
import { ActiveBlock } from '../../types'
import { moveFocus } from '../blockIdAndInfo'
import { currentSelection } from './useUpageSelection'

export function useUPageFocus() {
  const [activeBlock, focusD] = useReducerAtom(focusA, log(reduceFocus))
  return { activeBlock, focusD }
}

type FocusA =
  | { a: 'up'; id: str; xOffset?: num }
  | { a: 'down'; id: str; xOffset?: num }
  | { a: 'factory-backspace' }
  | { a: 'title-enter'; xOffset?: num }
  | { a: 'focus-last-selected' }
  | { a: 'set-active-block'; block: ActiveBlock }
  | { a: 'reset' }

export type UPageFocusD = (a: FocusA) => void

function reduceFocus(old: ActiveBlock, a: FocusA): ActiveBlock {
  switch (a.a) {
    case 'down':
      return { ...old, id: moveFocus('down', a.id), focus: { type: 'start', xOffset: a.xOffset } }
    case 'up':
      return { ...old, id: moveFocus('up', a.id), focus: { type: 'end', xOffset: a.xOffset } }
    case 'factory-backspace':
      return { ...old, id: moveFocus('last'), focus: { type: 'end' } }
    case 'title-enter':
      return { ...old, id: moveFocus('first'), focus: { type: 'end', xOffset: a.xOffset } }
    case 'reset':
      return { ...old, id: '', focus: undefined }
    case 'focus-last-selected':
      return { ...old, id: currentSelection.ids.at(-1) || '', focus: { type: 'end' } }
    case 'set-active-block':
      return { ...a.block }
  }
}

const focusA = atom(new ActiveBlock())
