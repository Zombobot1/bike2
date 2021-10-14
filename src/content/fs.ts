import { _Col, _FSD } from '../fb/fs'
import { JSObject, str } from '../utils/types'
import { ws } from './application'
import { blocksS } from './ublocks'

function $(name: str, data: [str, JSObject][]): _Col {
  return { name, docs: data.map(([id, data]) => ({ id, data })) }
}

export const _fs: _FSD = [$('ublocks', blocksS), $('ws', [['cat-lover', ws]]), $('_t', [['1', { d: 'test' }]])]
