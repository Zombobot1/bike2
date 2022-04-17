import { str, bool } from '../../../utils/types'
import { useMount } from './hooks'

const map = new Map<str, { finished: bool; result?: unknown; error?: unknown }>()

// doesn't work for upages
// FOR SORYBOOK & FETCH TESTS ONLY!
// cannot track promise without its id
export function useSuspense_<T>(id: str, promise: () => Promise<T>) {
  // when promise is fullfil this hook will be called again as if it's the 1st call
  if (!map.has(id)) {
    const p = promise()
      .then((data) => {
        map.set(id, { result: data, finished: true })
      })
      .catch((error) => {
        map.set(id, { error, finished: true })
      })

    map.set(id, { finished: false })

    _wrapPromise(p).read()
  } else if (map.get(id)?.error) {
    // map.delete(id) // causes endless rerender -> memory leak
    throw map.get(id)?.error
  }

  useMount(() => () => {
    map.delete(id)
  })

  return map.get(id)?.result
}

function _wrapPromise(promise: Promise<unknown>) {
  let status = 'pending'
  let result: unknown
  const jabka = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    },
  )
  return {
    read() {
      if (status === 'pending') {
        throw jabka
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    },
  }
}
