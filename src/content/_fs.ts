import { cls } from '../fb/cls'
import { _Col, _FSD } from '../fb/types'
import { JSObject, str } from '../utils/types'
import { _wsDTOs } from './ws'
import { _extraPages, _pageDTOs } from './pages'

function $(name: str, data: [str, JSObject][]): _Col {
  return { name, docs: data.map(([id, data]) => ({ id, data })) }
}

export const _fs: _FSD = [
  $(cls.workspaces, [
    ['cats-lover', _wsDTOs.lover],
    ['pets-and-animals', _wsDTOs.pets],
    ['medium', _wsDTOs.medium],
    ['small', _wsDTOs.small],
  ]),
  $(cls.upages, [
    ...(_extraPages as [str, JSObject][]),
    ['pets-and-animals', _pageDTOs.pets],
    ['medium', _pageDTOs.medium],
    ['small', _pageDTOs.small],
  ]),
  $('_t', [['1', { d: 'test' }]]),
]
