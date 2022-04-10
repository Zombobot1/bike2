import { doc, getFirestore, setDoc, getDoc, updateDoc, Bytes, arrayUnion } from '@firebase/firestore'
import { DocumentData } from 'firebase/firestore'
import { useCallback } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { useC } from '../components/utils/hooks/hooks'
import { bool, str } from '../utils/types'
import { FSSchema } from './FSSchema'
import { useFS } from './fs'
import { isInProduction } from './utils'
import { wait } from '../utils/utils'

function useFSData_<T extends keyof FSSchema>(
  col: T,
  id: str,
  initialData?: FSSchema[T],
): [FSSchema[T], (d: Partial<FSSchema[T]>) => void] {
  const { setDoc, getDoc } = useFS()

  const setData_ = useCallback(
    (data: Partial<FSSchema[T]>) => {
      setDoc(col, id, data)
    },
    [id], // otherwise sets old block
  )

  const data = getDoc(col, id, initialData)
  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as FSSchema[T], setData_]
}

export function useData<T extends keyof FSSchema>(
  col: T,
  id: str,
  initialData?: FSSchema[T],
): [FSSchema[T], (d: Partial<FSSchema[T]>) => void] {
  if (!isInProduction) return useFSData_(col, id, initialData)

  const setData_ = useCallback((data: Partial<FSSchema[T]>) => setData(col, id, data), [])
  const data = useFirestoreDocData(doc(useFirestore(), col, id), { initialData }).data // https://github.com/FirebaseExtended/reactfire/blob/main/docs/use.md#show-a-single-document
  if (!data && initialData) {
    addData(col, id, initialData)
    return [initialData, setData_]
  }

  if (!data) throw new Error(`Document ${id} in ${col} not found`)
  return [data as FSSchema[T], setData_]
}

// export function useEntireCollectionByUserId<T extends keyof FSSchema>(query: UQuery<T>) {
// if (!isInProduction) return useFSCollectionByUserId_(col) as FSSchema[T][]
// const { data } = useFirestoreCollectionData(q(col).orderBy(''))
// return
// }

// function useFSCollectionByUserId_<T extends keyof FSSchema>(col: T) {
//   const { queryDocs } = useFS()
//   return queryDocs(q(col, { combineWithUserId: true }))
// }

const delay = () => JSON.parse(localStorage.getItem('sorybook-delayResponses') || 'false') as bool
const waitABit = () => wait(delay() ? 1e3 : 0)
const promisify = <T>(data: T) => waitABit().then(() => data)

export function useFirestoreData() {
  if (isInProduction) return backend

  const { setDoc, getDoc, appendToArray } = useFS()

  const getData = useC(<T extends keyof FSSchema>(col: T, id: str) => promisify(getDoc(col, id) as FSSchema[T]))
  // const queryData = useC(<T extends keyof FSSchema>(query: UQuery<T>) => promisify(queryDocs(query) as FSSchema[T][]))

  const setData = useC(<T extends keyof FSSchema>(col: T, id: str, data: Partial<FSSchema[T]>) => {
    setDoc(col, id, data)
    return waitABit() as Promise<void>
  })

  const addData = useC(<T extends keyof FSSchema>(col: T, id: str, data: FSSchema[T]) => {
    setDoc(col, id, data)
    return waitABit() as Promise<void>
  })

  const appendDataToArray = useC(<T extends keyof FSSchema>(col: T, id: str, name: keyof FSSchema[T], data: Bytes) => {
    appendToArray(col, id, name as str, data)
    return waitABit() as Promise<void>
  })

  return {
    setData,
    addData,
    getData,
    appendDataToArray,
  }
}

const d = (col: str, id: str) => doc(getFirestore(), col, id)
// const c = (col: str) => collection(getFirestore(), col)
const setData = <T extends keyof FSSchema>(col: T, id: str, data: Partial<FSSchema[T]>, merge = true): Promise<void> =>
  setDoc(d(col, id), data as DocumentData, { merge })
const addData = <T extends keyof FSSchema>(col: T, id: str, data: FSSchema[T]): Promise<void> =>
  setData(col, id, data, false)

const getData = <T extends keyof FSSchema>(col: T, id: str): Promise<FSSchema[T]> =>
  getDoc(d(col, id)).then((snap) => snap.data()) as Promise<FSSchema[T]>
// const queryData = async <T extends keyof FSSchema>(q: UQuery<T>): Promise<FSSchema[T][]> => {
//   const _query = query(c(q.col), where(q.prop, q.op as WhereFilterOp, q.val))
//   const docs = await getDocs(_query)
//   const r: FSSchema[T][] = []
//   docs.forEach((d) => r.push(d.data() as FSSchema[T]))
//   return r
// }

const appendDataToArray = <T extends keyof FSSchema>(col: T, id: str, arrayName: keyof FSSchema[T], data: Bytes) =>
  updateDoc(d(col, id), { [arrayName]: arrayUnion(data) })

export let backend = {
  setData,
  addData,
  getData,
  appendDataToArray,
}

if (!isInProduction) {
  const error = () => Promise.reject(new Error('No server provided'))
  backend.setData = error
  backend.addData = error
  backend.getData = error as <T>() => Promise<T>
  // backend.queryData = error as <T>() => Promise<T[]>
  backend.appendDataToArray = error
}

export const mockBackend = (b: typeof backend) => (backend = b)
