import _ from 'lodash'

// see Vincent V comment
// https://stackoverflow.com/questions/70661021/structuredclone-not-available-in-typescript

export function structuredClone<T>(obj: T): T {
  return _.cloneDeep(obj)
}
