import * as Y from 'yjs'

// https://github.com/yjs/yjs/issues/352#issuecomment-1000453944
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type YMap<TObject extends Record<string, unknown>> = Y.Map<any> & {
  get<TKey extends keyof TObject>(key: TKey): TObject[TKey]
  set<TKey extends keyof TObject>(key: TKey, value: TObject[TKey]): void
  has<TKey extends keyof TObject>(key: TKey): boolean
  toJSON<T = TObject>(): T
}
