import { Patch } from 'immer'
import diff from 'microdiff'
import { JSObject } from '../types'

export function diffAsPatches(a: JSObject, b: JSObject): Patch[] {
  const r: Patch[] = []

  diff(a, b).forEach(({ type, path, value }) => {
    if (type === 'CHANGE') r.push({ op: 'replace', path, value })
    else if (type === 'CREATE') r.push({ op: 'add', path, value })
    else r.push({ op: 'remove', path })
  })

  return r
}
