import { bfsUBlocks } from '../editing/UPage/UPageState/crdtParser/UPageTree'
import { now } from 'lodash'
import { isStr, safe } from '../../utils/utils'
import { getUserId } from '../editing/UPage/userId'
import {
  InlineExerciseData,
  isAdvancedText,
  isStringBasedBlock,
  isUFormBlock,
  isUListBlock,
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
import { f, str, bool } from '../../utils/types'
import { Bytes } from 'firebase/firestore'
import { SendUPageUpdate } from '../../fb/upageChangesAPI'
import { uuid } from '../../utils/wrappers/uuid'
import { UFormRuntime } from '../editing/UPage/UPageState/crdtParser/UPageRuntimeTree'
import { getInitialIdeaState, mergeUpdates } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { IdeaData, IdeaType, UCardData, UCards } from './types'

type CreateIdeaInFS = (dto: IdeaDTO) => void
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
    const updates = getInitialIdeaState()
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

  save = (data: IdeaData): { success: bool; ucards?: UCards } => {
    const success = this.#save(data)
    if (this.isNew && success) {
      const { id, dto } = createTraining(this.#upageId, this.#id, data.ublocks, data.type || 'question')
      this.#training = { ...dto, id }
      this.#setTraining(id, dto)
    }

    return { success, ucards: undefined }
  }

  changePriority = (ucardId: str, priority: UCardPriority) => {
    if (!this.#training) throw new Error('Cannot change priority in new idea')
    const info = findInObject(this.#training.idAndIndicators, ucardId)
    info.priority = priority
    this.#setTraining(this.#training.id, { idAndIndicators: this.#training.idAndIndicators })
  }

  toggleFreeze = (ucardId: str) => {
    if (!this.#training) throw new Error('Cannot change priority in new idea')
    const info = findInObject(this.#training.idAndIndicators, ucardId)
    info.frozen = !info.frozen

    const frozen = Array.from(Object.values(this.#training.idAndIndicators)).every(({ frozen }) => frozen)

    this.#setTraining(this.#training.id, {
      idAndIndicators: this.#training.idAndIndicators,
      frozen: frozen,
    })
  }

  setType = (data: IdeaData, type: IdeaType) => {
    data.type = type
  }

  preview = (ucardId: str): str => {
    if (ucardId === 'r') return safe(this.#training).preview.slice(0, 10)
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

export const BAD_IDEA = 'Add question and provide answer!'

interface Update {
  update: Bytes
  description: UPageChangeDescriptionDTO
}

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

function createTraining(upageId: str, dataId: str, ublocks: UBlocks, type: IdeaType): { id: str; dto: TrainingDTO } {
  const indicators: TrainingIndicators = {
    priority: type === 'error' ? 'high' : 'medium',
    errorRate: 0,
    repeatAt: 0,
    stageId: '',
    timeToAnswer: 0,
  }
  return {
    id: uuid(),
    dto: {
      userId: getUserId(),
      upageId,
      ideaId: dataId,
      idAndIndicators: { r: indicators },
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

  const ucardPreview = (training: TrainingIdAndDTO, ucard: str, data?: UCardData) => {
    const info = training.idAndIndicators[ucard]
    const priority = priorityAndSymbol[info.priority]
    let preview = `${idea.preview(ucard)}${priority}`
    if (data) preview += `: ${data}`
    if (info.frozen) preview += ' (frozen)'
    return preview
  }

  const preview = () => {
    if (!training) throw new Error('Training not exist')
    const trainingSafe = safe(training)
    let r = `${training.preview} (${data.type || 'question'})`

    if (data.ucards) {
      const info = data.ucards.map((c) => ucardPreview(trainingSafe, c.id, c.data)).join(', ')
      r += ': ' + info
    } else {
      r += `: ${ucardPreview(trainingSafe, 'r')}`
    }
    return r
  }

  return { idea, getTraining: () => training, data, preview }
}

const priorityAndSymbol: Record<UCardPriority, str> = { high: '!', low: '', medium: '*' }
function findInObject<T>(obj: Record<str, T>, key: str) {
  return safe(Object.entries(obj).find(([k]) => k === key))[1]
}
