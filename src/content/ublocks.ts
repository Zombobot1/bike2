import { UBlockDTO } from '../components/editing/types'
import { Question } from '../components/studying/training/types'
import { str, strs } from '../utils/types'
import { _pages } from './application'
import { _kittensBlocks, _kittensForFocus, _kittensForLists } from './content'
import { IdAndBlocks } from './types'

const eq: Question = {
  correctAnswer: [],
  explanation: '',
  options: [],
  question: '',
}

export function qS(correctAnswer: strs, explanation: str, options: strs, question: str): str {
  return JSON.stringify({
    correctAnswer,
    question,
    explanation,
    options,
  })
}

const checks = qS(
  ['Right clicked', 'Right'],
  'Explanation',
  ['Right clicked', 'Right', 'Wrong', 'Wrong clicked'],
  'Select right:',
)

export const _removalPage = { color: '#39c6a5', name: 'Removal', ids: ['cat', 'emptyString', 'd', 'fluffyJpg'] }
export const _removalBlocks: IdAndBlocks = [
  ['cat', { type: 'TEXT', data: 'cat' }],
  ['f-full', { type: 'TEXT', data: 'f'.repeat(33) + ' ' + 'f'.repeat(33) }], // if word is too long caret position is calculated wrong
  ['d', { type: 'TEXT', data: 'd' }],
  ['emptyString', { type: 'TEXT', data: '' }],
]

const $ = JSON.stringify

export const blocksS: IdAndBlocks = [
  ..._pages,
  ..._kittensBlocks,
  ..._kittensForFocus,
  ..._removalBlocks,
  ..._kittensForLists,
  ['input1', { type: 'INPUT', data: $(eq) }],
  ['textarea1', { type: 'TEXTAREA', data: $(eq) }],
  ['checks1', { type: 'CHECKS', data: $(eq) }],
  ['checks2', { type: 'CHECKS', data: checks }],
  ['radio1', { type: 'RADIO', data: $(eq) }],

  ['empty-page', { type: 'PAGE', data: $({ color: '#39c6a5', name: '', ids: [] }) }],
  ['removal', { type: 'PAGE', data: $(_removalPage) }],
  ['emptyQ', { type: 'QUESTION', data: '' }],
  ['withoutAnswer', { type: 'QUESTION', data: $(['checks2']) }],
]
