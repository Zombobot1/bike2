import { useState } from 'react'
import { safe } from '../../../utils/utils'

export function useMap<K, V>(init: [K, V][] = []) {
  const [map, setMap] = useState(new Map<K, V>(init))

  return {
    _data: map,

    entries: () => [...map.entries()],
    values: () => Array.from(map.values()),
    has: (key: K) => map.has(key),
    get: (key: K) => map.get(key),
    getSafe: (key: K) => safe(map.get(key)),

    set: (key: K, v: V) => setMap((old) => new Map([...old.entries(), [key, v]])),
    delete: (key: K) =>
      setMap((old) => {
        old.delete(key)
        return new Map([...old.entries()])
      }),
  }
}
