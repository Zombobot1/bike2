import { doc, getFirestore, setDoc } from '@firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { bool, str } from '../utils/types'
import { useFS } from './fs'
import { _MOCK_FB } from './utils'

function useData_<T>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  const { setDoc, getDoc } = useFS()
  const data = getDoc(col, id, initialData)
  const setData_ = (data: Partial<T>) => setDoc(col, id, data)

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as T, setData_]
}

export function useData<T>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  if (process.env.NODE_ENV === 'development' && _MOCK_FB) return useData_(col, id, initialData)

  const setData_ = (data: Partial<T>) => setData(col, id, data)
  const data = useFirestoreDocData(doc(useFirestore(), col, id), { initialData }).data
  if (!data && initialData) {
    addData(col, id, initialData)
    return [initialData, setData_]
  }

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as T, setData_]
}

export function useSetData() {
  if (process.env.NODE_ENV !== 'development' || !_MOCK_FB) return { setData, addData }
  const { setDoc } = useFS()
  return { setData: setDoc, addData: setDoc }
}

const setData = <T>(col: str, id: str, data: T, merge = true) => setDoc(doc(getFirestore(), col, id), data, { merge })
const addData = <T>(col: str, id: str, data: T) => setData(col, id, data, false)
