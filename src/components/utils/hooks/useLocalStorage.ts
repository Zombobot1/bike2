import { useEffect, useState } from 'react'
import { State, str } from '../../../utils/types'

type V<T> = T | (() => T)

export function useLocalStorage<T>(key: str, defaultValue: V<T>) {
  return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage<T>(key: str, defaultValue: V<T>) {
  return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage<T>(key: str, defaultValue: V<T>, storageObject: Storage): State<T> {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)

    if (typeof defaultValue === 'function') {
      return (defaultValue as () => T)()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key)
    storageObject.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject])

  return [value, setValue]
}
