import { UBlockDTO } from '../components/editing/types'
import { Question } from '../components/studying/training/types'
import { str, strs } from '../utils/types'
import { IdANdBlocks, _kittensBlocks } from './content'

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

const $ = JSON.stringify

export const blocksS: IdANdBlocks = [
  ..._kittensBlocks,
  ['data1', { type: 'TEXT', data: 'initial data' }],
  ['data2', { type: 'TEXT', data: 'd' }],
  ['data4', { type: 'TEXT', data: '' }],
  ['file1', { type: 'FILE', data: '' }],
  ['file2', { type: 'FILE', data: 'http://uni.com/static/complex--name--uuid.pdf' }],
  // ['audio1', { type: 'AUDIO', data: fluffyMp3 }],
  ['audio2', { type: 'AUDIO', data: '' }],
  // ['image1', { type: 'IMAGE', data: fluffyJpg }],
  ['image2', { type: 'IMAGE', data: '' }],
  ['input1', { type: 'INPUT', data: $(eq) }],
  ['textarea1', { type: 'TEXTAREA', data: $(eq) }],
  ['checks1', { type: 'CHECKS', data: $(eq) }],
  ['checks2', { type: 'CHECKS', data: checks }],
  ['radio1', { type: 'RADIO', data: $(eq) }],

  ['page2', { type: 'PAGE', data: $({ color: '#39c6a5', name: 'Page 2', ids: ['data4', 'data2'] }) }],
  ['page3', { type: 'PAGE', data: $({ color: '#39c6a5', name: 'Page 3', ids: ['data2'] }) }],
  ['emptyQ', { type: 'QUESTION', data: '' }],
  ['withoutAnswer', { type: 'QUESTION', data: $(['checks2']) }],
]
