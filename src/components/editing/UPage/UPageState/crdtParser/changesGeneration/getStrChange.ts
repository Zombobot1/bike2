import { deleteInStr, insertInStr } from '../../../../../../utils/algorithms'
import { patienceDiff } from '../../../../../../utils/wrappers/patienceDiff'
import { num, str } from '../../../../../../utils/types'
import { safe } from '../../../../../../utils/utils'
import { ChangePreview, previewMaker, PreviewTag } from '../previewGeneration'

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
  preview: ChangePreview
}

export function getStrChanges(
  old: str,
  new_: str,
  { skipPreview = false, shortenPreview = true, ignoreConstantText = false } = {},
  previewBuilder = previewMaker,
): StrChanges {
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

  if (skipPreview) return { changes, preview: [] }

  const preview: ChangePreview = []
  let i = 0
  let segmentStartI = 0
  while (i < state.length) {
    while (state[i] === state[i + 1]) i++
    i += 1 // go to next segment

    const notChanged = state[i - 1] === '='

    const prevSegment = rawPreview.slice(segmentStartI, i)

    let tag = PreviewTag.no
    if (state[i - 1] === '-' && prevSegment) tag = PreviewTag.s
    else if (state[i - 1] === '+' && prevSegment) tag = PreviewTag.em

    if (ignoreConstantText && tag === PreviewTag.no) {
      segmentStartI = i
      continue
    }

    if (shortenPreview) {
      if (notChanged && segmentStartI === 0) {
        preview.push(previewBuilder.dotsBefore(prevSegment, tag)) // replace constant text at the start
      } else if (notChanged && i === state.length) {
        preview.push(previewBuilder.dotsAfter(prevSegment, tag)) // replace constant text at the end
      } else {
        preview.push(previewBuilder.dotsInside(prevSegment, tag)) // replace everything else
      }
    } else preview.push(previewBuilder.wrap(prevSegment, tag))

    segmentStartI = i
  }

  return { changes, preview }
}

export interface ChangeableStr {
  insert: (i: num, text: str) => void
  delete: (i: num, l: num) => void
  toJSON: () => str
  length: num
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

export function _strChanger(s: str): ChangeableStr {
  let strToChange = s
  const changer = {
    toJSON: () => strToChange,
    insert: (i: num, text: str) => {
      strToChange = insertInStr(strToChange, i, text)
    },
    delete: (i: num, l: num) => {
      strToChange = deleteInStr(strToChange, i, l)
    },
  }
  return Object.defineProperty(changer, 'length', { get: () => strToChange.length }) as ChangeableStr
}
