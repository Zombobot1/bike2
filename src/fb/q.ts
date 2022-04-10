import { query, where, orderBy, collection, getFirestore } from 'firebase/firestore'
import { getUserId } from '../components/editing/UPage/userId'
import { str } from '../utils/types'
import { FSSchema } from './FSSchema'

type FilterOperation = '==' | '<' | 'in'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter = { prop: str; op: str; val: any }
type Filters = Filter[]

export class UQuery<T extends keyof FSSchema> {
  filters: Filters = []
  order?: { prop: str; type: 'asc' | 'desc' }
  col = ''

  constructor(colName: T, combineWithUserId = false) {
    this.col = combineWithUserId ? colName + '-' + getUserId() : colName
  }

  where = (prop: keyof FSSchema[T], op: FilterOperation, val: unknown): UQuery<T> => {
    this.filters.push({ prop: prop as str, op, val })
    return this
  }

  orderBy = (prop: keyof FSSchema[T], type: 'asc' | 'desc' = 'asc'): UQuery<T> => {
    this.order = { prop: prop as str, type }
    return this
  }

  toQuery = () => {
    const colRef = collection(getFirestore(), this.col)
    const filters = this.filters.map(({ prop, op, val }) => where(prop, op as FilterOperation, val))
    if (this.order) filters.push(orderBy(this.order.prop, this.order.type))

    return query(colRef, ...filters)
  }
}

export const q = <T extends keyof FSSchema>(col: T, { combineWithUserId = false } = {}): UQuery<T> =>
  new UQuery(col, combineWithUserId)
