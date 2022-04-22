import { TrainingIdAndDTO, TrainingIndicators } from '../../fb/FSSchema'
import { str } from '../../utils/types'
import { WithUBlocks } from '../editing/UPage/ublockTypes'
import { _base64ToState } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { _stateToStr } from '../editing/UPage/UPageState/crdtParser/_fakeUPage'
import { IdeaData } from './types'

const empty = ``

const _ideaStates = {
  '': () => _base64ToState(empty), // idea cannot be empty
}

export type _IdeaStates = keyof typeof _ideaStates
export const _getIdeaState = (name: _IdeaStates) => _ideaStates[name]()

export function _ideaToStr(_idea: WithUBlocks) {
  const idea = _idea as IdeaData
  const blocks = _stateToStr(_idea)
  if (idea.$error) return `${idea.$error} ${blocks}`.trim()
  if (idea.type) return `(${idea.type}) ${blocks}`.trim()
  return blocks.trim()
}

const _indicator: TrainingIndicators = {
  id: '',
  failNumber: 0,
  repeatNumber: 0,
  priority: 'medium',
  repeatAt: 0,
  stageId: '',
  timeToAnswer: 0,
}

const indicator = (id = '', stageId = ''): TrainingIndicators => ({ ..._indicator, id, stageId })

const training: TrainingIdAndDTO = {
  id: 't',
  createdAt: 0,
  ideaId: '',
  indicators: [indicator()],
  preview: '',
  repeatAt: 0,
  upageId: '',
  userId: '',
}

const trg = (preview: str, indicators: TrainingIndicators[]): TrainingIdAndDTO => ({ ...training, preview, indicators })

export const _trainings = {
  mock: training,
  saq: trg('Q', [indicator()]),
  ie: trg('A __ and __', [indicator('a', '1'), indicator('b', '2')]),
}
