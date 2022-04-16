import { _Col, _FSD } from '../fb/types'
import { JSObject, str } from '../utils/types'
import { _wsDTOs } from './ws'
import { _extraPages, _pageDTOs } from './pages'
import { _fakeIdeaTrainingDTOs, _ideaDTOs, _ideaTrainingDTOs } from './ideas'
import { FSSchema } from '../fb/FSSchema'

function $(name: keyof FSSchema, data: [str, JSObject][]): _Col {
  return { name, docs: data.map(([id, data]) => ({ id, data })) }
}

type IdAndDocs = [str, JSObject][]
export const firestoreMockData: _FSD = [
  $('workspaces', [
    ['cat-lover', _wsDTOs.lover],
    ['pets-and-animals', _wsDTOs.pets],
    ['medium', _wsDTOs.medium],
    ['small', _wsDTOs.small],
  ]),
  $('upages', [
    ...(_extraPages as IdAndDocs),
    ['pets-and-animals', _pageDTOs.pets],
    ['medium', _pageDTOs.medium],
    ['small', _pageDTOs.small],
  ]),
  $('ideas', _ideaDTOs as IdAndDocs),
  $('trainings', [..._ideaTrainingDTOs, ..._fakeIdeaTrainingDTOs] as IdAndDocs),
  $('_t', [['1', { d: 'test' }]]),
]
