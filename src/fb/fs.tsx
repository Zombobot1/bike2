import { atom, useAtom } from 'jotai'
import _ from 'lodash'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useLog, useMount } from '../components/utils/hooks/hooks'
import { useArray } from '../components/utils/hooks/useArray'
import { _fs } from '../content/fs'
import { fn, JSObject, OJSObject, SetState, str } from '../utils/types'
import { safe } from '../utils/utils'

type Doc = { id: str; data: JSObject }
export type _Col = { name: str; docs: Doc[] }
export type _FSD = _Col[]
const pendingInsertions = new Map<str, JSObject>()
class State {
  fs = _fs
  setFS: SetState<_FSD> = fn
}

const FSContext = createContext<State | null>(null)
function useFS_(): State {
  const s = useContext(FSContext)
  if (!s) throw new Error('FS was used without context provider')
  return s
}

export const FSProvider: React.FC = ({ children }) => {
  const [fs, setFS] = useState(_.cloneDeep(_fs))
  return <FSContext.Provider value={{ fs, setFS }}>{children}</FSContext.Provider>
}

export function useFS() {
  const { fs, setFS } = useFS_()

  const get = (col: str, id: str): OJSObject => {
    return fs.find((c) => c.name === col)?.docs.find((d) => d.id === id)?.data ?? pendingInsertions.get(col + id)
  }

  const setDoc = (col: str, id: str, data: JSObject) => {
    setFS((old) => {
      if (pendingInsertions.has(col + id)) {
        data = { ...pendingInsertions.get(col + id), ...data }
        pendingInsertions.delete(col + id)
      }
      const collection = old.find((c) => c.name === col)
      if (!collection) old.push({ name: col, docs: [{ id, data }] })
      else {
        const docI = collection.docs.findIndex((d) => d.id === id)
        if (docI === -1) collection.docs.push({ id, data })
        else collection.docs[docI].data = { ...collection.docs[docI].data, ...data }
      }
      return [...old]
    })
  }

  const getDoc = (col: str, id: str, initialData?: JSObject) => {
    if (!initialData || get(col, id) !== undefined) return get(col, id)
    pendingInsertions.set(col + id, safe(initialData))
    return initialData
  }

  return { setDoc, getDoc }
}
