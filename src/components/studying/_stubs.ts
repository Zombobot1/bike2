import { WithUBlocks } from '../editing/UPage/ublockTypes'
import { _base64ToState } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { _stateToStr } from '../editing/UPage/UPageState/crdtParser/_fakeUPage'
import { IdeaData } from './types'

const empty = `AAAG5o2t/B8DBAADAEIABScCBAAnLidyb290dWJsb2Nrc3JkYXRheyJ1YmxvY2tzIjpbIuKAmCJdfXR5cGUEBwEEEQQDAQAABEEAQgAAAQUAAA==`

const _ideaStates = {
  '': () => _base64ToState(empty),
}

export type _IdeaStates = keyof typeof _ideaStates
export const _getIdeaState = (name: _IdeaStates) => _ideaStates[name]()

export function _ideaToStr(_idea: WithUBlocks) {
  const idea = _idea as IdeaData
  const blocks = _stateToStr(_idea)
  if (idea.$error) return `${idea.$error} ${blocks}`.trim()
  return blocks
}
