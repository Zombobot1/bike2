import { bool, JSObject, num, str, strs } from '../../../utils/types'
import { getEmptyStrings, isStr } from '../../../utils/utils'

export type UListBlock = 'bullet-list' | 'numbered-list' | 'toggle-list'
export type AdvancedTextBlock = 'code' | 'quote' | 'callout'
export type HeadingBlock = 'heading-1' | 'heading-2' | 'heading-3' | 'heading-0'
export type UTextBlock = 'text' | HeadingBlock | AdvancedTextBlock
export type UFileBlock = 'file' | 'image' | 'audio' | 'video'
export type UQuestionBlock = 'single-choice' | 'short-answer' | 'multiple-choice' | 'long-answer' | 'inline-exercise'
export type UProjectionBlock = 'grid' | 'page' | 'exercise' | UListBlock
type PseudoUBlock = 'inline-equation' | 'r' // r for root block
type OtherUBlocks = 'block-equation' | 'divider' | 'table' | PseudoUBlock
export type UBlockType = UTextBlock | UFileBlock | UQuestionBlock | UProjectionBlock | OtherUBlocks
export type UBlockTypes = UBlockType[]

export type UBlockContext = 'upage' | 'uform'

// all src are empty unless file uploading is succeeded (no blob urls)

export class UAudioFileData {
  src = ''
}

export class UMediaFileData {
  src = ''
  width? = 900
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
  text = ''
}

export class QuestionBase {
  question = ''
  explanation = ''
  $submitted?: bool
  $error?: str
  $editing?: bool = true
}

export class UChecksData extends QuestionBase {
  correctAnswer: strs = []
  options: strs = ['Option 1', 'Option 2']
  $answer?: strs
}

export class UInputData extends QuestionBase {
  correctAnswer = ''
  $answer?: str
}

export interface SubQuestion {
  i: num
  type: UBlockType
  correctAnswer: strs
  options: strs
  explanation: str
  $error?: str
  $answer?: strs
}
export type SubQuestions = SubQuestion[]
export type InlineExerciseContent = Array<str | SubQuestion>

export class InlineExerciseData {
  content: InlineExerciseContent = []
  $editing?: bool = true
  $submitted?: bool
  $editingError?: str
}

export class UFormLikeData {
  ublocks = [] as UBlocks
  $state?: 'filling' | 'editing' = 'editing' // form & questions are in editing mode upon creation via getDefaultData
  $score?: num = -1
}

export class UFormData extends UFormLikeData {
  name = ''
}

export class UGridColumnData {
  ublocks = [] as UBlocks
  width = ''
}

export type UGridData = UGridColumnData[]

export class UListItem {
  ublock: UBlock = { id: '', type: 'text', data: '' }
  children?: UListItem[]
  unmarked?: bool
  $isOpen?: bool
}

export type UListData = UListItem[]

export class UPageBlockData {
  id = ''
  $name? = ''
}

export class RootData {
  ublocks = [] as UBlocks
}

type File = UAudioFileData | UMediaFileData | UFileData
type QuestionData = UChecksData | UInputData | InlineExerciseData
export type UBlockNestedData = UGridData | UListData | UFormData
export type UBlockComplexData = File | QuestionData | UTableData | CalloutData | CodeData | UPageBlockData
export type UBlockData = str | UBlockComplexData | UBlockNestedData | RootData

export interface UBlock {
  id: str
  type: UBlockType
  data: UBlockData
}
export type UBlocks = UBlock[]

export const UBlockIdAttribute = 'data-ublock-id'

// using type to satisfy constraint Record<string, unknown>
export type UPageFlags = {
  fullWidth?: bool
  turnOffTOC?: bool
}

export interface UPageData extends UPageFlags {
  ublocks: UBlocks
}

export interface WithUBlocks {
  ublocks: UBlocks
}

// TODO: if removing block contained a file it should be removed via file uploader
// file components remove files via file uploader
// undo manager tracks if it deletes files and calls file uploader
// every 30 day a job is run which removes all files that marked as deleted and aren't used in the page (it may happen due to undo/redo)
// when page is about to be deleted after 30 days it removes all files that are associated with it
// deleted page is readonly
// when page is marked as deleted all it decks are marked as well. Card: { type: '', data: Bytes, deletedAt?: num, freezed?: }

export function isUTextBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['text', 'heading-1', 'heading-2', 'heading-3', 'heading-0', 'callout', 'quote', 'code']
  return types.includes(t)
}

export function isUHeaderBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['heading-1', 'heading-2', 'heading-3']
  return types.includes(t)
}

export function isNotFullWidthBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['image', 'video', 'table']
  return types.includes(t) || isUFormBlock(t)
}

export function isSelectableBlock(t?: UBlockType): bool {
  if (!t) return false
  return !isUListBlock(t) && t !== 'grid'
}

export function isSelectableByClickBlock(t?: UBlockType): bool {
  if (!t) return false
  return t === 'image' || t === 'divider'
}

export function isAdvancedText(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['code', 'callout']
  return types.includes(t)
}

export function isPlainTextBlock(t?: UBlockType): bool {
  if (!t) return false
  return isUTextBlock(t) && !isAdvancedText(t)
}

export function isIndexableBLock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['heading-1', 'heading-2', 'heading-3', 'exercise']
  return types.includes(t)
}

export function isUListBlock(t?: UBlockType): bool {
  if (!t) return false
  const types: UBlockTypes = ['bullet-list', 'numbered-list', 'toggle-list']
  return types.includes(t)
}

export function isFlat(t?: UBlockType): bool {
  if (!t) return false
  return t !== 'grid' && !isUListBlock(t) // forms can have girds - they are flat
}

export function mayContainPages(t?: UBlockType): bool {
  return !isFlat(t)
}

export function isUFormBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['single-choice', 'short-answer', 'multiple-choice', 'long-answer', 'inline-exercise']
  return types.includes(t)
}

export function isUFileBlock(t: UBlockType): bool {
  const types: UBlockTypes = ['file', 'image', 'audio', 'video']
  return types.includes(t)
}

export function isTrueUFileBlock(t: UBlockType): bool {
  return isUFileBlock(t) && t !== 'video'
}

export function isStringBasedBlock(t: UBlockType): bool {
  return isStr(getDefaultData(t))
}

// if blocks have strings as their data or have 'text' prop it means that they can turn into each other without data change
export function getDefaultData(type: UBlockType): UBlockData {
  switch (type) {
    case 'file':
      return new UFileData()
    case 'image':
    case 'video':
      return new UMediaFileData()
    case 'audio':
      return new UAudioFileData()

    case 'exercise':
      return new UFormData()

    case 'short-answer':
    case 'long-answer':
      return new UInputData()
    case 'multiple-choice':
    case 'single-choice':
      return new UChecksData()
    case 'inline-exercise':
      return new InlineExerciseData()

    case 'inline-equation':
    case 'r':
      throw new Error('No default data')

    case 'text':
    case 'heading-0':
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
    case 'divider':
    case 'block-equation':
    case 'quote':
      return ''

    case 'callout':
      return new CalloutData()
    case 'code':
      return new CodeData()

    case 'bullet-list':
    case 'numbered-list':
    case 'toggle-list':
      return [] as UListData

    case 'grid':
      return [] as UGridData

    case 'table':
      return [new UTableColumnData(), new UTableColumnData()] as UTableData

    case 'page':
      return new UPageBlockData()
  }
}

export function turnUBlockData(newType: UBlockType, oldData: UBlockData): UBlockData {
  let newData = getDefaultData(newType)
  // from text
  if (isStr(oldData)) {
    if (isStr(newData)) newData = oldData
    else if ('text' in (newData as JSObject)) (newData as { text: str }).text = oldData as str
  } else if (newType === 'text') {
    // to text from object
    if ('text' in (oldData as JSObject)) newData = (oldData as JSObject).text
  } else if ('text' in (oldData as JSObject) && 'text' in (newData as JSObject)) {
    ;(newData as { text: str }).text = (oldData as JSObject).text
  }
  // TODO: UFormBlocks
  // TODO: UListBLocks
  return newData as UBlockData
}
