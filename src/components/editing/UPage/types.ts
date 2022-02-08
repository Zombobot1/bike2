import { bool, num, str, strs } from '../../../utils/types'
import { getEmptyStrings } from '../../../utils/utils'

export type UListBlock = 'bullet-list' | 'numbered-list' | 'toggle-list'
export type AdvancedTextBlock = 'code' | 'quote' | 'callout'
export type HeadingBlock = 'heading-1' | 'heading-2' | 'heading-3' | 'heading-0'
export type UTextBlock = 'text' | HeadingBlock | AdvancedTextBlock
export type UFileBlock = 'file' | 'image' | 'audio' | 'video'
export type UQuestionBlock = 'single-choice' | 'short-answer' | 'multiple-choice' | 'long-answer' | 'inline-exercise'
export type UFormBlock = 'test' | 'exercise' | 'card'
export type UProjectionBlock = 'grid' | 'page' | UFormBlock | UListBlock
type PseudoUBlock = 'inline-equation' | 'l' // l for block wrappers in lists
type OtherUBlocks = 'block-equation' | 'divider' | 'table' | 'cards' | PseudoUBlock
export type UBlockType = UTextBlock | UFileBlock | UQuestionBlock | UProjectionBlock | OtherUBlocks
export type UBlockTypes = UBlockType[]

export class UAudioFileData {
  src = ''
}

export class UMediaFileData {
  src = ''
  width = 900
}

export class UFileData {
  src = ''
  name = ''
}

export class UTableColumnData {
  rows = getEmptyStrings(2)
  width = 190
}

export type UTableData = UTableColumnData[]

export class CalloutData {
  text = ''
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
}

export class CodeData {
  language = 'TypeScript'
  code = ''
}

export interface SubQuestion {
  i: num
  type: UBlockType
  correctAnswer: strs
  options: strs
  explanation: str
}
export type InlineExerciseData = Array<str | SubQuestion>

export class QuestionBase {
  question = ''
  explanation = ''
}

export class UChecksData extends QuestionBase {
  correctAnswer: strs = []
  options: strs = []
}

export class UInputData extends QuestionBase {
  correctAnswer = ''
}

export class UFormData {
  name = ''
  ublocks = [] as UBlocks
}

export class UGridColumnData {
  ublocks = [] as UBlocks
  id = ''
  width = ''
}

export type UGridData = UGridColumnData[]

export class UListItem {
  ublock: UBlock = { id: '', type: 'text', data: '' }
  children?: UListItem[]
  unmarked?: bool
}

export type UListData = UListItem[]

export interface UPageBlockData {
  id: str
  name: str
  color: str
}

type File = UAudioFileData | UMediaFileData | UFileData
type NestedData = UGridData | UListData | UFormData
type QuestionData = UChecksData | UInputData | InlineExerciseData
export type UBlockComplexData = File | NestedData | QuestionData | UTableData | CalloutData | CodeData | UPageBlockData
export type UBlockData = str | UBlockComplexData

export interface UBlock {
  id: str
  type: UBlockType
  data: UBlockData
}
export type UBlocks = UBlock[]

export interface UPageData {
  name: str
  color: str
  ublocks: UBlocks
  isDeleted?: bool
  fullWidth?: bool
  turnOffTOC?: bool
}

export function isUTextBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['text', 'heading-1', 'heading-2', 'heading-3', 'heading-0', 'callout', 'quote', 'code']
  return types.includes(t)
}

export function isNotFullWidthBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['image', 'video', 'table']
  return types.includes(t) || isUQuestionBlock(t)
}

export function isSelectableByClickBlock(t?: UBlockType): bool {
  if (!t) return false
  return t === 'image' || t === 'divider'
}

export function isAdvancedText(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['code', 'quote', 'callout']
  return types.includes(t)
}

export function isPlainTextBlock(t?: UBlockType): bool {
  if (!t) return false
  return isUTextBlock(t) && !isAdvancedText(t)
}

export function isIndexableBLock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['heading-1', 'heading-2', 'heading-3', 'cards', 'exercise']
  return types.includes(t)
}

export function isUListBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['bullet-list', 'numbered-list', 'toggle-list']
  return types.includes(t)
}

export function isFlat(t?: UBlockType): bool {
  if (!t) return false
  return t !== 'grid' && !isUListBlock(t)
}

export function mayContainPages(t?: UBlockType): bool {
  return !isFlat(t)
}

export function isUFormBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['test', 'exercise', 'card']
  return types.includes(t)
}

export function isUQuestionBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['single-choice', 'short-answer', 'multiple-choice', 'long-answer', 'inline-exercise']
  return types.includes(t)
}

export function isUFileBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['file', 'image', 'audio', 'video']
  return types.includes(t)
}
