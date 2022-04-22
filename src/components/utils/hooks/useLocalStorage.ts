import { useEffect, useState } from 'react'
import { State, str } from '../../../utils/types'
import { isStr } from '../../../utils/utils'
import { useGlobalEventListener } from './useGlobalEventListener'

type V<T> = T | (() => T)

export function useLocalStorage<T>(key: str, defaultValue: V<T>) {
  return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage<T>(key: str, defaultValue: V<T>) {
  return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage<T>(key: str, defaultValue: V<T>, storageObject: Storage): State<T> {
  const [value, setValue] = useState<T>(() => readValue(key, defaultValue, storageObject))

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key)
    storageObject.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event('storage-changed')) // We dispatch a custom event so every useLocalStorage hook are notified
  }, [key, JSON.stringify(value), storageObject]) // causes endless rerenders if value is object

  useGlobalEventListener('storage-changed', () => {
    setValue(readValue(key, defaultValue, storageObject))
  })

  return [value, setValue]
}

function readValue<T>(key: str, defaultValue: V<T>, storageObject: Storage): T {
  const default_ = typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
  const jsonValue = storageObject.getItem(key)
  if (jsonValue != null) {
    try {
      return JSON.parse(jsonValue)
    } catch (e) {
      if (isStr(default_)) return jsonValue as unknown as T
      throw e
    }
  }

  return default_
}
