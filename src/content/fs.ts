import { _Col, _FSD } from '../fb/types'
import { JSObject, str } from '../utils/types'
import { _wsDTOs } from './ws'
import { _extraPages, _pageDTOs } from './pages'
import { _fakeIdeaTrainingDTOs, _ideaDTOs, _ideaTrainingDTOs } from './ideas'
import { FSSchema } from '../fb/FSSchema'

function $(name: keyof FSSchema, data: [str, JSObject][], userId = ''): _Col {
  if (userId) name += '-' + userId
  return { name, docs: data.map(([id, data]) => ({ id, data })) }
}
type IdAndDocs = [str, JSObject][]
export const _fs: _FSD = [
  $('workspaces', [
    ['cat-lover', _wsDTOs.lover],
    ['pets-and-animals', _wsDTOs.pets],
    ['medium', _wsDTOs.medium],
    ['small', _wsDTOs.small],
  ]),
  $('upages', [
    ['pets-and-animals', _pageDTOs.pets],
    ['medium', _pageDTOs.medium],
    ['small', _pageDTOs.small],
    ...(_extraPages as IdAndDocs),
  ]),
  $('ideas', _ideaDTOs as IdAndDocs),
  $('trainings', _ideaTrainingDTOs as IdAndDocs, 'cat-lover'),
  $('trainings', _fakeIdeaTrainingDTOs as IdAndDocs, 'cat-lover1'),
  $('_t', [['1', { d: 'test' }]]),
]
