import { doc, getFirestore, setDoc, getDoc, updateDoc, Bytes, arrayUnion } from '@firebase/firestore'
import { useCallback } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { useC } from '../components/utils/hooks/hooks'
import { JSObject, str } from '../utils/types'
import { useFS } from './fs'
import { isInProduction } from './utils'

function useFSData_<T extends JSObject>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
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

export function useData<T extends JSObject>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  if (!isInProduction) return useFSData_(col, id, initialData)

  const setData_ = useCallback((data: Partial<T>) => setData(col, id, data), [])
  const data = useFirestoreDocData(doc(useFirestore(), col, id), { initialData }).data // https://github.com/FirebaseExtended/reactfire/blob/main/docs/use.md#show-a-single-document
  if (!data && initialData) {
    addData(col, id, initialData)
    return [initialData, setData_]
  }

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as T, setData_]
}

export function useFirestoreData() {
  if (isInProduction) return backend

  const { setDoc, getDoc, appendToArray } = useFS()

  const getData = useC(<T extends JSObject>(col: str, id: str) => Promise.resolve(getDoc(col, id)) as Promise<T>)

  const setData = useC((col: str, id: str, data: JSObject) => {
    setDoc(col, id, data)
    return Promise.resolve()
  })

  const addData = useC((col: str, id: str, data: JSObject) => {
    setDoc(col, id, data)
    return Promise.resolve()
  })

  const appendDataToArray = useC((col: str, id: str, name: str, data: Bytes) => {
    appendToArray(col, id, name, data)
    return Promise.resolve()
  })

  return {
    setData,
    addData,
    getData,
    appendDataToArray,
  }
}

const d = (col: str, id: str, subCol?: str) =>
  subCol ? doc(getFirestore(), col, id, subCol) : doc(getFirestore(), col, id)
const setData = <T extends JSObject>(col: str, id: str, data: Partial<T>, merge = true, subCol?: str): Promise<void> =>
  setDoc(d(col, id, subCol), data as T, { merge }) // as T????
const addData = <T extends JSObject>(col: str, id: str, data: T, subCol?: str): Promise<void> =>
  setData(col, id, data, false, subCol)
const getData = <T extends JSObject>(col: str, id: str): Promise<T> =>
  getDoc(d(col, id)).then((snap) => snap.data()) as Promise<T>

const appendDataToArray = (col: str, id: str, arrayName: str, data: Bytes) =>
  updateDoc(d(col, id), { [arrayName]: arrayUnion(data) })

export let backend = {
  setData,
  addData,
  getData,
  appendDataToArray,
}

if (!isInProduction) {
  const error = () => Promise.reject('No server provided')
  backend.setData = error
  backend.addData = error
  backend.getData = error as <T>() => Promise<T>
  backend.appendDataToArray = error
}

export const mockBackend = (b: typeof backend) => (backend = b)
