import { createContext, useContext } from 'react'
import { useC } from '../components/utils/hooks/hooks'
import { useCurrentState } from '../components/utils/hooks/usePrevious'
import { f, JSObject, OJSObject, str } from '../utils/types'
import { safe } from '../utils/utils'
import { structuredClone } from '../utils/wrappers/clone'
import { _FSD } from './types'

let _fsd: _FSD = []
export const setFSD = (n: _FSD) => (_fsd = n)

const pendingInsertions = new Map<str, JSObject>()
class State {
  getFS: () => _FSD = () => []
  setFS: (n: _FSD) => void = f
}

const FSContext = createContext<State | null>(null)
function useFS_(): State {
  const s = useContext(FSContext)
  if (!s) throw new Error('FS was used without context provider')
  return s
}

export const FSProvider: React.FC = ({ children }) => {
  const [getFS, setFS] = useCurrentState(structuredClone(_fsd))
  return <FSContext.Provider value={{ getFS, setFS }}>{children}</FSContext.Provider> // React component -> .tsx
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
      const fs = getFS()
      const existingData = fs.find((c) => c.name === col)?.docs.find((d) => d.id === id)?.data
      return existingData ?? pendingInsertions.get(col + id)
    }

    if (!initialData || get(col, id) !== undefined) return get(col, id)
    pendingInsertions.set(col + id, safe(initialData))
    return initialData
  })

  const appendToArray = useC((col: str, id: str, arrayName: str, data: unknown) => {
    const doc = getDoc(col, id)
    const newData = { ...doc }
    newData[arrayName] = [...newData[arrayName], data]
    setDoc(col, id, newData)
  })

  return { setDoc, getDoc, appendToArray }
}
