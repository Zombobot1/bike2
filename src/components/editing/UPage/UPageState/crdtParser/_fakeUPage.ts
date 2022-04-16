import { str, JSObject, strs, num, bool } from '../../../../../utils/types'
import { isObjOrArr, isStr } from '../../../../../utils/utils'
import { uuid } from '../../../../../utils/wrappers/uuid'
import {
  UPageData,
  UBlock,
  UBlockData,
  UBlockType,
  UBlocks,
  UListItem,
  UListData,
  UGridData,
  UInputData,
  UChecksData,
  InlineExerciseData,
  SubQuestion,
  InlineExerciseContent,
  UFormData,
  isUFormBlock,
  UTableData,
  getDefaultData,
  isStringBasedBlock,
} from '../../ublockTypes'
import { bfsUBlocks } from './UPageTree'

export const _stateToStr = (state: UPageData): str => {
  return state.ublocks.map(ublockToStr).join('_')
}

// some generators are duplicated because some build data for tests the others for stories

const b = (id = '', data?: UBlockData, type: UBlockType = 'text'): UBlock => {
  let blockData = data ?? id
  if (!data && !isStringBasedBlock(type)) blockData = getDefaultData(type)

  return {
    id: id || uuid({ short: true }),
    data: blockData,
    type,
  }
}
const cols = (...columns: UBlocks[]): UGridData => columns.map((col) => ({ width: '', ublocks: col }))
const g = (...columns: UBlocks[]): UBlock => ({ id: 'g', data: cols(...columns), type: 'grid' })

const grid = (cols: UBlocks[], width: strs) =>
  b('', cols.map((col, i) => ({ width: width[i], ublocks: col })) as UGridData, 'grid')

const e = (ublocks: UBlocks = [], $editing?: bool, name?: str): UBlock => {
  const data: UFormData = { name: name ?? 'e', ublocks }
  if ($editing !== undefined) data.$state = $editing ? 'editing' : 'filling'
  bfsUBlocks(data.ublocks)
    .filter((b) => isUFormBlock(b.type))
    .forEach((b) => ((b.data as UInputData).$editing = $editing))
  return { id: 'e', data, type: 'exercise' }
}
const ex = (name = '', ublocks: UBlocks = []) => b('', { name, ublocks }, 'exercise')

const t = (data = '') => b('', data, 'text')
const h1 = (data = '') => b('', data, 'heading-1')
const h2 = (data = '') => b('', data, 'heading-2')
const h3 = (data = '') => b('', data, 'heading-3')
const q = (data = '') => b('', data, 'quote')
const cal = (text = '', t: 'i' | 'w' | 's' | 'e') =>
  b('', { text, type: t === 'e' ? 'error' : t === 'i' ? 'info' : t === 's' ? 'success' : 'warning' }, 'callout')

const code = (text = '', l = 'Text') => b('', { text, language: l }, 'code')
const image = (src = '', width = 900, id = '') => b(id, { src, width }, 'image')
const video = (src = '', width = 900) => b('', { src, width }, 'video')
const audio = (src = '', id = '') => b(id, { src }, 'audio')
const file = (src = '', name = '', id = '') => b(id, { src, name }, 'file')
const p = (id: str) => b('', { id }, 'page')

const lr = (...items: UListItem[]): UBlock => ({ id: 'l', data: items, type: 'bullet-list' })
const l = (ublock: str | UBlock, children?: UListData, unmarked?: bool, $isOpen?: bool): UListItem => {
  ublock = (isStr(ublock) ? b(ublock as str) : ublock) as UBlock
  const r: UListItem = children?.length ? { ublock, children } : { ublock }
  if ($isOpen) r.$isOpen = $isOpen
  if (unmarked) r.unmarked = unmarked
  return r
}

const list = (t: '*' | '.' | '>', ...items: UListItem[]) =>
  b('', items, t === '*' ? 'bullet-list' : t === '.' ? 'numbered-list' : 'toggle-list')

const mcq = (q = '', ca = [] as strs, options = [] as strs, e = '', a = [] as strs, err = ''): UBlock => ({
  id: q || uuid({ short: true }),
  data: { question: q, correctAnswer: ca, explanation: e, options, $answer: a, $error: err },
  type: 'multiple-choice',
})

const scq = (q = '', ca = [] as strs, options = [] as strs, e = '', a = [] as strs, err = ''): UBlock => ({
  id: q || uuid({ short: true }),
  data: { question: q, correctAnswer: ca, explanation: e, options, $answer: a, $error: err },
  type: 'single-choice',
})

const saq = (q = '', ca = 'a', e = '', a = '', err = ''): UBlock => ({
  id: q || uuid({ short: true }),
  data: { question: q, correctAnswer: ca, explanation: e, $answer: a, $error: err },
  type: 'short-answer',
})

const laq = (q = '', e = '', a = '', err = ''): UBlock => {
  const data: UInputData = { question: q, correctAnswer: '', explanation: e, $answer: a }
  if (err) data.$error = err
  return {
    id: q || uuid({ short: true }),
    data,
    type: 'long-answer',
  }
}

const sq = (t: '(' | '[' | '_', ca = ['a'], options = [] as strs, e = '', a = [] as strs, err = ''): SubQuestion => {
  const r: SubQuestion = {
    i: 0,
    correctAnswer: ca,
    explanation: e,
    options,
    type: t === '(' ? 'single-choice' : t === '[' ? 'multiple-choice' : 'short-answer',
    $answer: a,
  }
  if (err) r.$error = err
  return r
}
const subq = (i: num, t: '(' | '[' | '_', ca = ['a'], e = '', options = [] as strs): SubQuestion => {
  const r: SubQuestion = {
    i,
    correctAnswer: ca,
    explanation: e,
    options,
    type: t === '(' ? 'single-choice' : t === '[' ? 'multiple-choice' : 'short-answer',
  }
  return r
}

const ie = (...content: InlineExerciseContent): UBlock => ({
  id: 'ie',
  data: { content },
  type: 'inline-exercise',
})
const inEx = (...content: InlineExerciseContent) => b('', { content }, 'inline-exercise')

type S = { ublocks: UBlocks }
const d = (state: S, i = 0): UBlockData => state.ublocks[i].data
const ufd = (state: S, i = 0): UFormData => d(state, i) as UFormData
const uid = (state: S, i = 0): UInputData => d(state, i) as UInputData
const ucd = (state: S, i = 0): UChecksData => d(state, i) as UChecksData
const ied = (state: S, i = 0): InlineExerciseData => d(state, i) as InlineExerciseData

const div = () => b('', '', 'divider')
const eq = (equation = '') => b('', equation, 'block-equation')
const table = (d: UTableData) => b('', d, 'table')

export const _generators = {
  eq,
  b,
  g,
  e,
  ex,
  lr,
  l,
  mcq,
  scq,
  saq,
  laq,
  sq,
  subq,
  ie,
  inEx,
  d,
  ufd,
  uid,
  ucd,
  ied,
  code,
  file,
  audio,
  image,
  video,
  h1,
  h2,
  h3,
  t,
  q,
  cal,
  list,
  grid,
  p,
  div,
  table,
}

const ublockToStr = (b: UBlock): str => {
  if (isStr(b.data)) return b.data as str
  if (Array.isArray(b.data)) return arrToStr(b.data)
  return objToStr(b.data as JSObject)
}

const objToStr = (o: JSObject): str => {
  if ('data' in o && 'type' in o && 'id' in o) return ublockToStr(o as UBlock)
  return `{${Object.entries(o)
    .map(([_, v]) => {
      if (Array.isArray(v)) return arrToStr(v)
      if (isObjOrArr(v)) return objToStr(v)
      return v
    })
    .join(', ')}}`
}

const arrToStr = (arr: unknown[]): str => {
  const content = arr.map((v) => {
    if (isStr(v)) return v
    if (Array.isArray(v)) return arrToStr(v)
    return objToStr(v as JSObject)
  })

  return `[${content.join(', ')}]`
}
