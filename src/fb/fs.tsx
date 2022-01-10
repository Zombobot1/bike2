import _ from 'lodash'
import { createContext, useContext } from 'react'
import { useC } from '../components/utils/hooks/hooks'
import { useCurrentState } from '../components/utils/hooks/usePrevious'
import { _fs } from '../content/fs'
import { fn, JSObject, OJSObject, str } from '../utils/types'
import { safe } from '../utils/utils'

type Doc = { id: str; data: JSObject }
export type _Col = { name: str; docs: Doc[] }
export type _FSD = _Col[]
const pendingInsertions = new Map<str, JSObject>()
class State {
  getFS: () => _FSD = () => []
  setFS: (n: _FSD) => void = fn
}

const FSContext = createContext<State | null>(null)
function useFS_(): State {
  const s = useContext(FSContext)
  if (!s) throw new Error('FS was used without context provider')
  return s
}

export const FSProvider: React.FC = ({ children }) => {
  const [getFS, setFS] = useCurrentState(_.cloneDeep(_fs))
  return <FSContext.Provider value={{ getFS, setFS }}>{children}</FSContext.Provider>
}

export function useFS() {
  const { getFS, setFS } = useFS_()

  const setDoc = useC((col: str, id: str, data: JSObject) => {
    const old = getFS()
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
    setFS([...old])
  })

  const getDoc = useC((col: str, id: str, initialData?: JSObject) => {
    const get = (col: str, id: str): OJSObject => {
      const existingData = getFS()
        .find((c) => c.name === col)
        ?.docs.find((d) => d.id === id)?.data
      return existingData ?? pendingInsertions.get(col + id)
    }

    if (!initialData || get(col, id) !== undefined) return get(col, id)
    pendingInsertions.set(col + id, safe(initialData))
    return initialData
  })

  return { setDoc, getDoc }
}
