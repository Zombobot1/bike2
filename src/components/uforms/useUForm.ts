import { useCallback, useReducer } from 'react'
import { num, str, strs } from '../../utils/types'
import { avg } from '../../utils/algorithms'
import useUpdateEffect from '../utils/hooks/useUpdateEffect'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useC = <T extends (...args: any[]) => any>(fn: T, deps = []): T => useCallback(fn, deps)

export function useUForm({ isEditing = false, ids = [] as strs } = {}) {
  const [state, d] = useReducer(uformR, {
    ...new UFormState(),
    state: isEditing ? 'isEditing' : 'isFilling',
    size: ids.length,
  })

  useUpdateEffect(() => d({ a: 'update-size', size: ids.length }), [JSON.stringify(ids)])

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
  | { a: 'update-size'; size: num }
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
      return { ...new UFormState(), size: old.size }
    case 'update-size':
      return { ...old, size: a.size }
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
  if (scores.indexOf(-1) === -1 && scores.length === old.size) return Math.round(avg(scores) * 100)
  return -1
}

class UFormState {
  size = 0
  validationError = ''
  idAndScore = new Map<str, num>()
  idAndError = new Map<str, str>()
  score = -1
  submissionAttempt = 0
  state: 'isFilling' | 'isEditing' | 'wasSubmitted' = 'isFilling'
}
