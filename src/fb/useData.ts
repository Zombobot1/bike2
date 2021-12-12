import { doc, getFirestore, setDoc, getDoc } from '@firebase/firestore'
import { useCallback } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { str } from '../utils/types'
import { useFS } from './fs'
import { _MOCK_FB } from './utils'

function useData_<T>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  const { setDoc, getDoc } = useFS()
  const data = getDoc(col, id, initialData)
  const setData_ = useCallback(
    (data: Partial<T>) => {
      setDoc(col, id, data)
    },
    [id], // otherwise sets old block
  )

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as T, setData_]
}

export function useData<T>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  if (process.env.NODE_ENV === 'development' && _MOCK_FB) return useData_(col, id, initialData)

  const setData_ = useCallback((data: Partial<T>) => setData(col, id, data), [])
  const data = useFirestoreDocData(doc(useFirestore(), col, id), { initialData }).data
  if (!data && initialData) {
    addData(col, id, initialData)
    return [initialData, setData_]
  }

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as T, setData_]
}

export function useFirestoreData() {
  if (process.env.NODE_ENV !== 'development' || !_MOCK_FB) return { setData, addData, getData }
  const { setDoc, getDoc } = useFS()
  return {
    setData: setDoc,
    addData: setDoc,
    getData: <T>(col: str, id: str) => Promise.resolve(getDoc(col, id)) as Promise<T>,
  }
}

const d = (col: str, id: str) => doc(getFirestore(), col, id)
const setData = <T>(col: str, id: str, data: Partial<T>, merge = true) =>
  setDoc(doc(getFirestore(), col, id), data as T, { merge }) // as T????
const addData = <T>(col: str, id: str, data: T) => setData(col, id, data, false)
const getData = <T>(col: str, id: str): Promise<T> => getDoc(d(col, id)).then((snap) => snap.data()) as Promise<T>
