import * as Y from 'yjs'
import { str } from '../../../../../utils/types'

// https://github.com/yjs/yjs/issues/352#issuecomment-1000453944
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type YObject<TObject extends Record<str, unknown>> = Y.Map<any> & {
  get<TKey extends keyof TObject>(key: TKey): TObject[TKey]
  set<TKey extends keyof TObject>(key: TKey, value: TObject[TKey]): void
  has<TKey extends keyof TObject>(key: TKey): boolean
  toJSON<T = TObject>(): T
}
