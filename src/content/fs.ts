import { _Col, _FSD } from '../fb/types'
import { JSObject, str } from '../utils/types'
import { _wsDTOs } from './ws'
import { _extraPages, _pageDTOs } from './pages'
import { _ideaDTOs } from './ideas'
import { FSSchema } from '../fb/FSSchema'

function $(name: keyof FSSchema, data: [str, JSObject][]): _Col {
  return { name, docs: data.map(([id, data]) => ({ id, data })) }
}

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
    ...(_extraPages as [str, JSObject][]),
  ]),
  $('ideas', _ideaDTOs as [str, JSObject][]),
  $('_t', [['1', { d: 'test' }]]),
]
