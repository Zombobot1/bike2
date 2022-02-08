import { applyStrChanges, ChangeableStr, getStrChanges, StrChanges, _strChanger } from './getStrChange'
import { bool, JSObject, num, nums, SetStr, str, strs } from '../../../../utils/types'
import { isObjD, isStr, safe } from '../../../../utils/utils'

import { Patch, produceWithPatches } from 'immer'
import { insertAt } from '../../../../utils/algorithms'
const state = {
  n: 'a',
  a: 3,
}

export type ObjectChange =
  | { t: 'change'; value: num | bool; path: CPath }
  | { t: 'change-str'; changes: StrChanges; path: CPath }
  | { t: 'create'; value: unknown; path: CPath }
  | { t: 'delete'; path: CPath }
export type ObjectChanges_ = ObjectChange[]

export interface ObjectChanges {
  changes: ObjectChanges_
  preview: str
}

export function getObjectChanges(ublockPath: CPath, object: JSObject, patches: Patch[]): ObjectChanges {
  const preview = [] as strs

  const changes = patches.map((patch): ObjectChange => {
    const { op, value } = patch
    const path = [...ublockPath, ...patch.path]
    if (op === 'add') {
      if (isObjD(value) || isStr(value)) preview.push(newObjectPreview(value))
      return { t: 'create', value, path }
    }

    if (op === 'remove') {
      if (isObjD(value) || isStr(value)) preview.push(newObjectPreview(value))
      return { t: 'delete', path }
    }

    if (op === 'replace' && isStr(value)) {
      const strChanges = getStrChanges(getStrFromObject(object, patch.path), value)
      preview.push(strChanges.preview)
      return { t: 'change-str', changes: strChanges, path }
    }

    return { t: 'change', value, path }
  })

  return { changes, preview: preview.filter(Boolean).join('<br>') }
}

const newStrPreview = (s: str, { em = false } = {}) => {
  const data = s.length > 12 ? s.slice(0, 8) + '...' : s
  if (em) return `<em>${data}</em>`
  return data
}

type CPath = (string | number)[]
type Inserted = str | JSObject | unknown[]

const deepPreview = (obj: Inserted): str => {
  if (isStr(obj)) return newStrPreview(obj as str)

  const preview = [] as strs

  if (Array.isArray(obj)) {
    for (const element of obj) {
      const previewPart = deepPreview(element as Inserted)
      if (previewPart.length) preview.push(previewPart)
    }
  } else {
    Object.entries(obj).forEach(([_, value]) => {
      if (isStr(value)) {
        const previewPart = newStrPreview(value)
        if (previewPart.length) preview.push(previewPart)
      }
    })
  }

  return preview.length ? preview.join(' ') : ''
}

const newObjectPreview = (obj: Inserted) => {
  if (isStr(obj)) return newStrPreview(obj as str)
  return deepPreview(obj)
}

export interface ChangeableObject {
  create: (path: CPath, value: unknown) => void
  delete: (path: CPath) => void
  change: (path: CPath, value: num | bool) => void
  getStrToChange: (path: CPath) => ChangeableStr
}

export function applyObjectChanges(old: ChangeableObject, changes: ObjectChanges) {
  changes.changes.forEach((change) => {
    const { path, t } = change
    if (t === 'create') old.create(path, change.value)
    else if (t === 'delete') old.delete(path)
    else if (t === 'change-str') applyStrChanges(old.getStrToChange(path), change.changes)
    else old.change(path, change.value)
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function _objectChanger(o: JSObject): ChangeableObject & { o: JSObject } {
  function createPath(p: CPath, v: unknown) {
    let obj = o as any
    for (let i = 0; i < p.length; i++) {
      const step = p[i]
      if (i === p.length - 1) {
        if (Array.isArray(obj)) obj.splice(step as num, 0, v)
        else obj[step] = v
      } else if (isStr(step) && !(step in obj)) obj[step] = {}
      else if (!isStr(step) && !(step in obj)) obj[step] = []
      obj = obj[step]
    }
  }

  function deletePath(p: CPath) {
    let obj = o as any
    while (p.length > 1) obj = obj[safe(p.shift())]
    delete obj[p[0]]
  }

  return {
    o,
    change: (p, v) => {
      let obj = o as any
      while (p.length > 1) obj = obj[safe(p.shift())]
      obj[p[0]] = v
    },
    create: (p, v) => {
      createPath(p, v)
    },
    delete: (p) => {
      deletePath(p)
    },
    getStrToChange: (p) => {
      let obj = o as any
      while (p.length > 1) obj = obj[safe(p.shift())]
      return _strChanger(obj[p[0]], (v) => (obj[p[0]] = v))
    },
  }
}

const getStrFromObject = (o: JSObject, p: CPath): str => {
  let obj = o as any
  while (p.length > 1) obj = obj[safe(p.shift())]
  return obj[p[0]]
}
