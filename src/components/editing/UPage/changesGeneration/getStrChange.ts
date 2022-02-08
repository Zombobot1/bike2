import { deleteInStr, insertAt, insertInStr } from '../../../../utils/algorithms'
import { patienceDiff } from '../../../../utils/wrappers/patienceDiff'
import { f, num, SetStr, str } from '../../../../utils/types'
import { safe } from '../../../../utils/utils'

type Insertion = {
  text: str
  atI: num
}

type Deletion = {
  atI: num
  length: num
}

type StrChanges_ = Array<Insertion | Deletion>

export interface StrChanges {
  changes: StrChanges_
  preview: str
}

export function getStrChanges(old: str, new_: str): StrChanges {
  const diff = patienceDiff(old, new_).lines as { line: str; aIndex: num; bIndex: num }[] // a - old, b - new

  const changes = [] as StrChanges_

  let rawPreview = ''
  let state = ''
  for (let i = 0; i < diff.length; i++) {
    const { aIndex, bIndex, line: char } = diff[i]

    if (aIndex === -1) {
      const prevAIndex = diff[i - 1]?.aIndex
      if (prevAIndex === -1) (safe(changes.at(-1)) as Insertion).text += char
      else changes.push({ text: char, atI: prevAIndex !== undefined ? prevAIndex + 1 : 0 })
      state += '+'
    } else if (bIndex === -1) {
      const prevBIndex = diff[i - 1]?.bIndex
      if (prevBIndex === -1) (safe(changes.at(-1)) as Deletion).length += 1
      else changes.push({ atI: prevBIndex !== undefined ? prevBIndex + 1 : 0, length: 1 })
      state += '-'
    } else state += '='
    rawPreview += char
  }

  let preview = ''
  let i = 0
  let segmentStartI = 0
  while (i < state.length) {
    while (state[i] === state[i + 1]) i++
    i += 1 // go to next segment

    const notChanged = state[i - 1] === '='

    let prevSegment = rawPreview.slice(segmentStartI, i)
    // replace constant text at the start
    if (notChanged && segmentStartI === 0 && prevSegment.length > 12) prevSegment = '...' + prevSegment.slice(-8)
    // replace constant text at the end
    else if (notChanged && i === state.length && prevSegment.length > 12) prevSegment = prevSegment.slice(0, 8) + '...'
    // replace everything else
    else if (prevSegment.length > 12) prevSegment = prevSegment.slice(0, 4) + '...' + prevSegment.slice(-4)

    if (state[i - 1] === '-' && prevSegment) prevSegment = `<s>${prevSegment}</s>`
    else if (state[i - 1] === '+' && prevSegment) prevSegment = `<em>${prevSegment}</em>`

    segmentStartI = i
    preview += prevSegment
  }

  return { changes, preview }
}

export interface ChangeableStr {
  insert: (i: num, text: str) => void
  delete: (i: num, l: num) => void
  toJSON: () => str
}

export function applyStrChanges(str: ChangeableStr, changes: StrChanges) {
  let deltaI = 0
  for (const change of changes.changes) {
    if ('text' in change) {
      str.insert(change.atI + deltaI, change.text)
      deltaI += change.text.length
    } else {
      str.delete(change.atI, change.length)
      deltaI -= change.length
    }
  }
}

export function _strChanger(s: str, update: SetStr = f): ChangeableStr {
  let strToChange = s
  return {
    toJSON: () => strToChange,
    insert: (i, text) => {
      strToChange = insertInStr(strToChange, i, text)
      update(strToChange)
    },
    delete: (i, l) => {
      strToChange = deleteInStr(strToChange, i, l)
      update(strToChange)
    },
  }
}
