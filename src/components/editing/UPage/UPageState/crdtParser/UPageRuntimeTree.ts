/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { avg } from '../../../../../utils/algorithms'
import { bool, JSObject, num, str } from '../../../../../utils/types'
import { isObj, isObjOrArr, isStr, safe } from '../../../../../utils/utils'
import {
  InlineExerciseData,
  isStringBasedBlock,
  isUFormBlock,
  isUListBlock,
  SubQuestion,
  UBlock,
  UBlockData,
  UBlocks,
  UBlockType,
  UChecksData,
  UFormData,
  UFormLikeData,
  UInputData,
  UListData,
  UPageBlockData,
} from '../../ublockTypes'
import { bfsUBlocks } from './UPageTree'

// runtime tree is not a independent abstraction but a set of several

interface UPageTree {
  getUBlock: (id: str) => UBlock
}

export class UFormRuntime {
  static submit = (uform: UFormLikeData, ublocks: UBlocks) => {
    const error = setValidationErrors(ublocks)
    if (error) return

    triggerSubmit(ublocks, 'set')
    uform.$score = getScore(ublocks)
  }

  static toggleEdit = (uform: UFormLikeData, ublocks: UBlocks): bool => {
    // assume that when got from server & it is undefined it is like 'filling'
    if (uform.$state === 'editing') {
      const error = setValidationErrors(ublocks, { checkCorrectAnswer: true })
      if (error) return false

      uform.$state = 'filling'
      setEditing(ublocks, false)
    } else {
      uform.$state = 'editing'

      // cleaning filling related data
      this.clearFillingData(uform, ublocks)

      setEditing(ublocks, true)
    }
    return true
  }

  static clearFillingData = (uform: UFormLikeData, ublocks: UBlocks) => {
    setValidationErrors(ublocks, { unset: true })
    triggerSubmit(ublocks, 'unset')
    clearAnswers(ublocks)
    uform.$score = -1
  }
}

export type UFormEvent = 'submit' | 'toggle-edit'
export type UPageUFormEvent = 'retry' | UFormEvent

export class UPageUFormRuntime {
  #tree: UPageTree

  constructor(tree: UPageTree) {
    this.#tree = tree
  }

  submit = (id: str) => {
    const { ublocks, uform } = this.#get(id)
    UFormRuntime.submit(uform, ublocks)
  }

  retry = (id: str) => {
    const { ublocks, uform } = this.#get(id)
    UFormRuntime.clearFillingData(uform, ublocks)
  }

  toggleEdit = (id: str) => {
    const { ublocks, uform } = this.#get(id)
    UFormRuntime.toggleEdit(uform, ublocks)
  }

  #get = (id: str) => {
    const uform = this.#tree.getUBlock(id).data as UFormData
    const ublocks = flatten(uform.ublocks)
    return { uform, ublocks }
  }
}

export function nameNestedPages(ublocks: UBlocks, getPageName: (id: str) => str) {
  bfsUBlocks(ublocks).forEach((b) => {
    if (b.type !== 'page') return

    const data = b.data as UPageBlockData
    data.$name = getPageName(data.id)
  })
}

export function isAnswerCorrect(type: UBlockType, data: UBlockData): bool {
  if (isUChecks(type)) return getUChecksScore(data as UChecksData) > 0.99
  if (isUInput(type)) return getUInputScore(data as UInputData) > 0.99
  return getInlineExerciseScore(data as InlineExerciseData) > 0.99 // https://dev.to/alldanielscott/how-to-compare-numbers-correctly-in-javascript-1l4i
}

export function isSubQuestionCorrect(type: UBlockType, sq: SubQuestion): bool {
  if (isUChecks(type)) return getUChecksScore({ ...sq, question: '' }) > 0.99
  return (
    getUInputScore({ correctAnswer: sq.correctAnswer[0], explanation: '', question: '', $answer: sq.$answer?.[0] }) >
    0.99
  )
}

export function deriveUFromError(ublocks: UBlocks): str {
  for (const block of flatten(ublocks)) {
    if (block.type === 'inline-exercise') {
      const data = block.data as InlineExerciseData
      if (data.$editingError) return data.$editingError

      for (const sq of data.content) {
        if (isStr(sq)) continue

        if (sq.$error) return sq.$error
      }

      return ''
    }

    const data = block.data as UChecksData
    return data.$error || ''
  }

  return ''
}

export const ANSWER_REQUIRED = 'Provide answer!'
export const INVALID_EXERCISE = 'Invalid exercise!'

const typeOf = (b: UBlock | UBlockType) => (isObj(b) ? (b as UBlock).type : (b as UBlockType))

const isUChecks = (b: UBlock | UBlockType) => {
  const type = typeOf(b)
  return type === 'single-choice' || type === 'multiple-choice'
}
const isUInput = (b: UBlock | UBlockType) => {
  const type = typeOf(b)
  return type === 'short-answer' || type === 'long-answer'
}

function isUFormBlockValid(block: UBlock, { checkCorrectAnswer = false } = {}): bool {
  if (!isUFormBlock(block.type)) return true

  if (block.type === 'long-answer' && checkCorrectAnswer) return true

  if (isUChecks(block)) {
    const data = block.data as UChecksData
    return checkCorrectAnswer ? !!data.correctAnswer.length : !!data.$answer?.length
  }

  if (isUInput(block)) {
    const data = block.data as UInputData
    return checkCorrectAnswer ? !!data.correctAnswer.length : !!data.$answer?.length
  }

  return false
}

function setEditing(ublocks: UBlocks, editing: bool) {
  ublocks.forEach((b) => ((b.data as UChecksData).$editing = editing))
}

function setValidationErrors(ublocks: UBlocks, { checkCorrectAnswer = false, unset = false } = {}): bool {
  let foundError = false
  for (const block of ublocks) {
    foundError = setError(block, { checkCorrectAnswer, unset }) || foundError
  }
  return foundError
}

function setError(block: UBlock, { checkCorrectAnswer = false, unset = false } = {}): bool {
  let foundError = false

  if (block.type === 'inline-exercise') {
    const data = block.data as InlineExerciseData
    if (!data.content.length) {
      if (!data.$editingError) data.$editingError = ANSWER_REQUIRED
      return true
    } else if (data.$editingError) return true // error was set by component itself

    if (data.content.length) {
      data.content.forEach((strOrSubQ) => {
        if (isStr(strOrSubQ)) return false

        const sq = strOrSubQ as SubQuestion
        if (unset) {
          if (sq.$error) sq.$error = ''
          return false
        }

        const valid = checkCorrectAnswer ? !!sq.correctAnswer.length : !!sq.$answer?.length
        if (!valid) {
          sq.$error = ANSWER_REQUIRED
          foundError = true
        }
      })
    } else {
      data.$editingError = ANSWER_REQUIRED
      foundError = true
    }

    if (unset) {
      if (data.$editingError) data.$editingError = ''
      return false
    }
    return foundError
  }

  const data = block.data as UChecksData

  if (unset) {
    if (data.$error) data.$error = ''
    return false
  }

  const valid = isUFormBlockValid(block, { checkCorrectAnswer })
  if (!valid) data.$error = ANSWER_REQUIRED

  return !valid
}

function getUChecksScore(data: UChecksData): num {
  if (!data.$answer) return 0
  const difference = _.difference(
    data.correctAnswer.map((a) => a.toLowerCase()),
    safe(data.$answer).map((a) => a.toLowerCase()),
  ).length

  if (!difference) return 1
  if (difference >= data.correctAnswer.length) return 0
  return difference / data.correctAnswer.length
}

function getUInputScore(data: UInputData): num {
  if (!data.$answer) return 0
  return +(safe(data.$answer).toLowerCase() === data.correctAnswer.toLowerCase())
}

function getInlineExerciseScore(data: InlineExerciseData): num {
  const questions = data.content.filter((s) => !isStr(s)) as SubQuestion[]
  const scores = questions.map((q): num => getUChecksScore({ ...q, question: '' }))
  return avg(scores)
}

function triggerSubmit(ublocks: UBlocks, type: 'set' | 'unset') {
  return ublocks.map((b) => ((b.data as UChecksData).$submitted = type === 'set'))
}

function clearAnswers(ublocks: UBlocks) {
  ublocks.forEach((b) => {
    if (isUChecks(b)) (b.data as UChecksData).$answer = []
    else if (isUInput(b)) (b.data as UInputData).$answer = ''
    else {
      const data = b.data as InlineExerciseData
      data.content.forEach((d) => {
        if (isStr(d)) return
        const data = d as SubQuestion
        data.$answer = []
      })
    }
  })
}

function getScore(ublocks: UBlocks): num {
  const questions = ublocks
  const scores = questions.map((b) => {
    if (isUChecks(b)) return getUChecksScore(b.data as UChecksData)
    if (b.type === 'short-answer') return getUInputScore(b.data as UInputData)
    if (b.type === 'long-answer') return 1
    return getInlineExerciseScore(b.data as InlineExerciseData)
  })
  return Math.round(avg(scores) * 100)
}

const flatten = (ublocks: UBlocks): UBlocks => bfsUBlocks(ublocks).filter((b) => isUFormBlock(b.type))

export class RuntimeDataKeeper {
  #idAndData = new Map<str, RuntimeData>()

  constructor(bfsRoute: UBlocks) {
    for (const block of bfsRoute) {
      if (isStringBasedBlock(block.type)) continue
      const runtimeData = extractRuntimeData(block.data)
      if (runtimeData.length) this.#idAndData.set(block.id, runtimeData)
    }
  }

  transferRuntimeData = (tree: { getUnsafeUBlock: (id: str) => UBlock | undefined }) => {
    Array.from(this.#idAndData.entries()).forEach(([id, runtimeData]) => {
      const block = tree.getUnsafeUBlock(id)
      if (block) {
        if (isUListBlock(block.type)) {
          const list = block.data as UListData
          setRuntimeData(
            block.data,
            runtimeData.filter(({ path }) => path[0] < list.length),
          )
        } else setRuntimeData(block.data, runtimeData)
      }
    })
  }
}

function setRuntimeData(blockData: any, runtimeData: RuntimeData) {
  for (const { data, path } of runtimeData) createPath(path, blockData, data)
}

function createPath(path: Path, ref: any, value: any) {
  path.forEach((step, i) => {
    if (i === path.length - 1) {
      ref[step] = value
      return
    }

    const nextStep = path[i + 1]

    if (!(step in ref)) {
      const nextRef = isStr(nextStep) ? {} : []
      ref[step] = nextRef
      ref = nextRef
    } else ref = ref[step]
  })
}

function extractRuntimeData(blockData: any): RuntimeData {
  const r = [] as RuntimeData
  if (Array.isArray(blockData)) r.push(...traverseArray(blockData, []))
  else if (isObjOrArr(blockData)) r.push(...traverseObject(blockData, []))
  return r
}

type Path = Array<str | num>
type RuntimeData = { data: any; path: Path }[]

function traverseArray(arr: any[], path: Path): RuntimeData {
  const r = [] as RuntimeData
  arr.forEach((value, i) => {
    const newPath = [...path, i]
    if (Array.isArray(value)) r.push(...traverseArray(value, newPath))
    else if (isObjOrArr(value)) r.push(...traverseObject(value, newPath))
  })
  return r
}

function traverseObject(obj: JSObject, path: Path): RuntimeData {
  const r = [] as RuntimeData

  // shallow traverse for deep blocks
  Object.entries(obj).forEach(([k, v]) => {
    const newPath = [...path, k]
    if (k.startsWith('$')) r.push({ data: v, path: newPath })
    else if (k.startsWith('ublock')) return
    else if (Array.isArray(v)) r.push(...traverseArray(v, newPath))
    else if (isObjOrArr(v)) r.push(...traverseObject(v, newPath))
  })

  return r
}
