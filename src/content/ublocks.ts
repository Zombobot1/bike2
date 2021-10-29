import { str, strs } from '../utils/types'
import { _pages } from './application'
import { _kittensBlocks, _kittensForFocus, _kittensForLists, _kittensQuiz } from './content'
import { IdAndBlocks } from './types'

export function qS(correctAnswer: strs, explanation: str, options: strs, question: str): str {
  return JSON.stringify({
    correctAnswer,
    question,
    explanation,
    options,
  })
}

export const _oneBlockPage = { color: '#39c6a5', name: 'Empty 1', ids: ['emptyString'] }
export const _removalPage = { color: '#39c6a5', name: 'Removal', ids: ['cat', 'emptyString', 'd', 'fluffyJpg'] }
export const _removalBlocks: IdAndBlocks = [
  ['cat', { type: 'text', data: 'cat' }],
  ['f-full', { type: 'text', data: 'f'.repeat(33) + ' ' + 'f'.repeat(33) }], // if word is too long caret position is calculated wrong
  ['d', { type: 'text', data: 'd' }],
  ['emptyString', { type: 'text', data: '' }],
]

const $ = JSON.stringify

export const blocksS: IdAndBlocks = [
  ..._pages,
  ..._kittensBlocks,
  ..._kittensForFocus,
  ..._removalBlocks,
  ..._kittensForLists,
  ..._kittensQuiz,
  ['empty-page', { type: 'page', data: $({ color: '#39c6a5', name: '', ids: [] }) }],
  ['removal', { type: 'page', data: $(_removalPage) }],
  ['emptyQ', { type: 'question', data: '' }],
  ['withoutAnswer', { type: 'question', data: $(['checks2']) }],
]
