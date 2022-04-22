import { bfsUBlocks } from '../editing/UPage/UPageState/crdtParser/UPageTree'
import { isStr, safe } from '../../utils/utils'
import { getUserId } from '../editing/UPage/userId'
import {
  InlineExerciseData,
  isAdvancedText,
  isStringBasedBlock,
  isUFormBlock,
  isUListBlock,
  SubQuestion,
  SubQuestions,
  UBlock,
  UBlocks,
  UChecksData,
} from '../editing/UPage/ublockTypes'
import {
  IdeaDTO,
  TrainingDTO,
  TrainingIdAndDTO,
  TrainingIndicators,
  UCardPriority,
  UPageChangeDescriptionDTO,
} from '../../fb/FSSchema'
import { f, str, bool, num } from '../../utils/types'
import { Bytes } from 'firebase/firestore'
import { SendUPageUpdate } from '../../fb/upageChangesAPI'
import { uuid } from '../../utils/wrappers/uuid'
import { UFormRuntime } from '../editing/UPage/UPageState/crdtParser/UPageRuntimeTree'
import { getInitialUPageState, mergeUpdates } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { IdeaData, IdeaType } from './types'
import { now } from '../../utils/wrappers/timeUtils'

export type CreateIdeaInFS = (dto: IdeaDTO) => void
export type SetTrainingInFS = (id: str, dto: Partial<TrainingDTO>) => void
export type PartialIdeaData = {
  id: str
  ownerId: str
  upageId: str
  createIdea: CreateIdeaInFS
}
export type PartialTrainingData = {
  training?: TrainingIdAndDTO
  setTraining: SetTrainingInFS
}

export class IdeaRelatedState {
  #collector: IdeaChangesCollector
  #id: str
  #upageId: str
  #training?: TrainingIdAndDTO
  #setTraining: SetTrainingInFS

  constructor(idea: PartialIdeaData, training: PartialTrainingData, sendUpdate: SendUPageUpdate) {
    const { id, ownerId, upageId, createIdea } = idea
    // assume that on creation component should rerender (at least one prop should change) -> no need to trigger anything
    const sendUpdateOrCreate: SendUPageUpdate = (id, update, description) => {
      // first update doesn't have description
      if (this.isNew) createIdea({ ownerId, upageId, updates: [update] })
      else sendUpdate(id, update, description)
    }

    this.#collector = new IdeaChangesCollector(id, sendUpdateOrCreate)

    this.#training = training.training
    this.#setTraining = training.setTraining

    this.#id = id
    this.#upageId = upageId
  }

  initializeIfNew = (): Bytes[] => {
    if (!this.isNew) return []
    const updates = getInitialUPageState()
    this.#collector.interceptUpdate('', updates[0], { date: 0, preview: [], sha: '', user: '', upageId: '' })
    return updates
  }

  get interceptUpdate(): SendUPageUpdate {
    return this.#collector.interceptUpdate
  }

  get hasUnsavedChanges(): bool {
    if (this.#training) return !!this.#collector.collectedUpdates.length
    return this.#collector.collectedUpdates.length > 1 // 1st is initial data
  }

  edit = (data: IdeaData) => {
    const formBlock = data.ublocks.find((b) => isUFormBlock(b.type))
    UFormRuntime.toggleEdit(data, formBlock ? [formBlock] : [])
  }

  save = (data: IdeaData): bool => {
    const success = this.#save(data)

    if (this.isNew && success) {
      const { id, dto } = createTraining(this.#upageId, this.#id, data.ublocks, data.type || 'question')
      this.#training = { ...dto, id }
      this.#setTraining(id, dto)
      // TODO: sync idea & training indicators on idea open or show during training
    } else if (success && this.#training) {
      const preview = extractPreview(data.ublocks)
      const indicators = regenerateIndicators(data.ublocks, data.type || 'question', this.#training.indicators)
      this.#training.preview = preview
      this.#training.indicators = indicators
      this.#setTraining(this.#training.id, { preview, indicators })
    }

    return success
  }

  changePriority = (ucardId: num, priority: UCardPriority) => {
    if (!this.#training) throw new Error('Cannot change priority in new idea')
    const info = this.#training.indicators[ucardId]
    info.priority = priority
    this.#setTraining(this.#training.id, { indicators: this.#training.indicators })
  }

  toggleFreeze = (ucardId: num) => {
    if (!this.#training) throw new Error('Cannot change priority in new idea')
    const info = this.#training.indicators[ucardId]
    info.frozen = !info.frozen

    const frozen = this.#training.indicators.every(({ frozen }) => frozen)

    this.#setTraining(this.#training.id, {
      indicators: this.#training.indicators,
      frozen: frozen,
    })
  }

  ucardInfos = (data: IdeaData): UCardInfos => {
    const r = [] as UCardInfos

    const ucardInfo = (id: num, { priority, frozen }: TrainingIndicators): UCardInfo => {
      return { id, preview: this.#preview(id, data), priority, frozen }
    }

    if (this.#training) {
      if (getExercise(data.ublocks)) {
        this.#training.indicators.forEach((indicator, i) => r.push(ucardInfo(i, indicator)))
      } else r.push(ucardInfo(0, this.#training.indicators[0]))
    }

    return r
  }

  setType = (data: IdeaData, type: IdeaType) => {
    data.type = type
  }

  #preview = (ucardId: num, data: IdeaData): str => {
    const exercise = getExercise(data.ublocks)
    if (!exercise) return safe(this.#training).preview
    if (exercise) {
      const data = exercise.data as InlineExerciseData
      const question = data.content.find((sq) => !isStr(sq) && sq.i === ucardId)
      if (!question) return '' // when sq is removed preview is called before indicators are updated
      return sqToId(question as SubQuestion)
    }
    return '' // safe()
  }

  get isNew(): bool {
    return !this.#training
  }

  #save = (data: IdeaData): bool => {
    const formBlock = data.ublocks.find((b) => isUFormBlock(b.type))

    if (!formBlock) {
      data.$error = BAD_IDEA
      return false
    }

    const invalid = UFormRuntime.isChangeInvalid([formBlock])
    if (!invalid) {
      this.#collector.sendToServer()
      if (data.$error) data.$error = ''
      return true
    }

    data.$error = BAD_IDEA
    return false
  }
}

const getExercise = (ublocks: UBlocks) => ublocks.find((b) => b.type === 'inline-exercise')
const getUFormBlock = (ublocks: UBlocks) => ublocks.find((b) => isUFormBlock(b.type))

export const BAD_IDEA = 'Add question and provide answer!'

interface Update {
  update: Bytes
  description: UPageChangeDescriptionDTO
}

type UCardInfo = { id: num; preview: str; priority: UCardPriority; frozen?: bool }
type UCardInfos = UCardInfo[]

class IdeaChangesCollector {
  collectedUpdates: Update[] = []

  constructor(public id: str, public sendUpdate: SendUPageUpdate) {}

  interceptUpdate: SendUPageUpdate = (_, update, description) => {
    this.collectedUpdates.push({ update, description })
  }

  sendToServer = () => {
    if (!this.collectedUpdates.length) return
    mergeUpdates(this.id, this.collectedUpdates, this.sendUpdate)
    this.collectedUpdates = []
  }
}

function createIndicators(ublocks: UBlocks, type: IdeaType): TrainingIndicators[] {
  const r: TrainingIndicators[] = []

  if (type === 'question' || type === 'error') {
    const exercise = ublocks.find((b) => b.type === 'inline-exercise')
    const priority: UCardPriority = type === 'error' ? 'high' : 'medium'

    if (exercise) {
      const data = exercise.data as InlineExerciseData
      const questions = data.content.filter((sq) => !isStr(sq)) as SubQuestions
      questions.forEach((q) => r.push({ ...indicators, id: q.correctAnswer.join(', '), priority }))
    } else r.push({ ...indicators, priority })
  }

  return r
}

function regenerateIndicators(
  ublocks: UBlocks,
  type: IdeaType,
  oldIndicators: TrainingIndicators[],
): TrainingIndicators[] {
  const r: TrainingIndicators[] = []

  if (type === 'question' || type === 'error') {
    const block = safe(getUFormBlock(ublocks))
    const priority: UCardPriority = type === 'error' ? 'high' : 'medium'

    if (block.type === 'inline-exercise') {
      const data = (block.data as InlineExerciseData).content.filter((sq) => !isStr(sq)) as SubQuestions
      data.forEach((sq) => {
        const id = sqToId(sq)
        const old = oldIndicators.find((indicator) => indicator.id === id)
        return r.push(old || { ...indicators, priority, id })
      })
    } else r.push(!oldIndicators[0].id ? oldIndicators[0] : { ...indicators, priority }) // new indicators if ie -> another block
  }

  return r
}

const sqToId = (sq: SubQuestion): str => sq.correctAnswer.join(', ')

const indicators: TrainingIndicators = {
  id: '',
  priority: 'medium',
  failNumber: 0,
  repeatNumber: 0,
  repeatAt: 0,
  stageId: '',
  timeToAnswer: 0,
}

function createTraining(upageId: str, dataId: str, ublocks: UBlocks, type: IdeaType): { id: str; dto: TrainingDTO } {
  return {
    id: uuid(),
    dto: {
      userId: getUserId(),
      upageId,
      ideaId: dataId,
      indicators: createIndicators(ublocks, type),
      preview: extractPreview(ublocks),
      repeatAt: 0,
      createdAt: now(),
    },
  }
}

function extractPreview(ublocks: UBlocks, maxLength = 50): str {
  let r = ''
  let i = 0

  while (r.length < maxLength && i < ublocks.length) {
    r += preview(ublocks[i++]) + ' '
  }

  return r.trim().slice(0, maxLength)
}

function preview(block: UBlock): str {
  if (isUListBlock(block.type))
    return bfsUBlocks([block])
      .slice(1)
      .map((b) => preview(b))
      .join(' ')

  if (isStringBasedBlock(block.type)) return block.data as str
  if (isAdvancedText(block.type)) return (block.data as { text: str }).text
  if (isUFormBlock(block.type)) {
    if (block.type === 'inline-exercise') {
      const data = block.data as InlineExerciseData
      return data.content
        .map((sq) => {
          if (isStr(sq)) return sq

          if (sq.type === 'short-answer') return '__'
          const options = sq.options.join()
          return sq.type === 'single-choice' ? `(${options})` : `[${options}]`
        })
        .flat()
        .join(' ')
    }

    const data = block.data as UChecksData
    return data.question
  }

  return ''
}

export function _ideaRS(data: IdeaData, initialTraining?: TrainingIdAndDTO) {
  let training = initialTraining

  const idea = new IdeaRelatedState(
    { id: 'ideaId', ownerId: '', upageId: '', createIdea: f },
    {
      training,
      setTraining: (id, dto) => {
        if (!training) training = { ...(dto as TrainingDTO), id }
        else training = Object.assign(training, dto)
      },
    },
    f,
  )

  const preview = () => {
    if (!training) throw new Error('Training does not exist')
    let r = `${training.preview} (${data.type || 'question'})`

    r +=
      ': ' +
      idea
        .ucardInfos(data)
        .map((c) => {
          const priority = priorityAndSymbol[c.priority]
          return `${c.preview}${priority}${c.frozen ? ' (frozen)' : ''}`
        })
        .join(', ')

    return r
  }

  return { idea, getTraining: () => training, data, preview }
}

const priorityAndSymbol: Record<UCardPriority, str> = { high: '!', low: '', medium: '*' }
