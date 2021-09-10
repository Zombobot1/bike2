import { doc, getFirestore, setDoc } from '@firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { bool, str } from '../../../utils/types'

export function useData<T>(col: str, id: str, initialData?: T): [T, (d: Partial<T>) => void] {
  const { data } = useFirestoreDocData(doc(useFirestore(), col, id), { initialData })
  const setData_ = (data: Partial<T>) => setData(col, id, data)

  if (!data && initialData) {
    addData(col, id, initialData)
    return [initialData, setData_]
  }
  if (!data) throw new Error('Document not found')

  // const r = initialData && checkIsNew(data as T) ? initialData : (data as T) // initial data should now be replaced by empty data
  return [data as T, setData_]
}

export const addData = <T,>(col: str, id: str, data: T) => setDoc(doc(getFirestore(), col, id), data)
export const setData = <T,>(col: str, id: str, data: T) => setDoc(doc(getFirestore(), col, id), data, { merge: true })
