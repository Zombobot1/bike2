import { query, where, orderBy, collection, getFirestore } from 'firebase/firestore'
import { str } from '../utils/types'
import { FSSchema } from './FSSchema'

type FilterOperation = '==' | '<' | 'in'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter = { prop: str; op: str; val: any }
type Filters = Filter[]

export class UQuery<T extends keyof FSSchema> {
  filters: Filters = []
  order?: { prop: str; type: 'asc' | 'desc' }

  constructor(public col: T) {}

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

  toString = (): str => {
    const filters = this.filters.map((f) => `${f.prop}${f.op}${f.val}`).join(' ')
    const order = this.order ? `${this.order.prop} ${this.order.type}` : ''
    return `${this.col} ${filters} ${order}`.trim()
  }
}

export const q = <T extends keyof FSSchema>(col: T): UQuery<T> => new UQuery(col)
