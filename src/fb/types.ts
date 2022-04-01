import { JSObject, str } from '../utils/types'

type Doc = { id: str; data: JSObject }
export type _Col = { name: str; docs: Doc[] }
export type _FSD = _Col[]
