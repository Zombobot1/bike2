import { useReducer } from 'react'
import { bool, num, str } from '../../utils/types'
import { avg } from '../../utils/algorithms'
import { useC } from '../utils/hooks/hooks'
import { getUFormSize } from '../editing/UPage/blockIdAndInfo'

export function useUForm({ id, isEditing = false }: { id: str; isEditing?: bool }) {
  const [state, d] = useReducer(uformR, {
    ...new UFormState(),
    state: isEditing ? 'isEditing' : 'isFilling',
    id,
  })

  const onSubmissionAttempt = useC((id: str, score: num, error = '') => d({ a: 'submit-question', id, score, error }))
  const resolveError = useC((id: str) => d({ a: 'resolve-error', id }))

  return {
    d,
    onSubmissionAttempt,
    resolveError,
    validationError: state.validationError,
    wasSubmitted: state.state === 'wasSubmitted',
    submissionAttempt: state.submissionAttempt,
    score: state.score,
    isEditing: state.state === 'isEditing',
  }
}

type UFormA =
  | { a: 'submit' }
  | { a: 'retry' }
  | { a: 'toggle-edit' }
  | { a: 'submit-question'; id: str; score: num; error?: str }
  | { a: 'resolve-error'; id: str }

function uformR(old: UFormState, a: UFormA): UFormState {
  switch (a.a) {
    case 'submit':
      return { ...old, submissionAttempt: old.submissionAttempt + 1 }
    case 'toggle-edit':
      if (old.state === 'isEditing') return { ...old, submissionAttempt: old.submissionAttempt + 1 } // view form
      return { ...old, state: 'isEditing', idAndScore: new Map() } // edit form
    case 'retry':
      return { ...new UFormState(), id: old.id }
    case 'submit-question': {
      if (a.error) {
        old.idAndError.set(a.id, a.error)
        return { ...old, validationError: a.error }
      }
      old.idAndScore.set(a.id, a.score)
      const score = getScore(old)
      if (score > -1) {
        if (old.state === 'isEditing') return { ...old, state: 'isFilling', idAndScore: new Map() }
        return { ...old, score, state: 'wasSubmitted' }
      }
      return { ...old }
    }
    case 'resolve-error': {
      old.idAndError.delete(a.id)
      return { ...old, validationError: Array.from(old.idAndError.values())[0] || '' }
    }
  }
}

function getScore(old: UFormState): num {
  const scores = Array.from(old.idAndScore.values())
  if (scores.indexOf(-1) === -1 && scores.length === getUFormSize(old.id)) return Math.round(avg(scores) * 100)
  return -1
}

class UFormState {
  id = ''
  validationError = ''
  idAndScore = new Map<str, num>()
  idAndError = new Map<str, str>()
  score = -1
  submissionAttempt = 0
  state: 'isFilling' | 'isEditing' | 'wasSubmitted' = 'isFilling'
}
