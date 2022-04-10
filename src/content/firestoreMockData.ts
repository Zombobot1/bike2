import { _Col, _FSD } from '../fb/types'
import { JSObject, str } from '../utils/types'
import { _wsDTOs } from './ws'
import { _extraPages, _pageDTOs } from './pages'
import { _fakeIdeaTrainingDTOs, _ideaDTOs, _ideaTrainingDTOs } from './ideas'
import { FSSchema } from '../fb/FSSchema'

function $(colName: keyof FSSchema, data: [str, JSObject][], userId = ''): _Col {
  if (userId) colName += '-' + userId
  return { name: colName, docs: data.map(([id, data]) => ({ id, data })) }
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
  $('trainings', _ideaTrainingDTOs as IdAndDocs, 'cat-lover'),
  $('trainings', _fakeIdeaTrainingDTOs as IdAndDocs, 'cat-lover1'),
  $('_t', [['1', { d: 'test' }]]),
]
