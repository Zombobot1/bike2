import { str, strs } from '../../utils/types'
import { UBlockGetDTO } from './types'
import hospitalMp3 from '../../content/hospital.mp3'
import hospitalPng from '../../content/hospital.png'
import { Question } from '../study/training/types'

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

export const blocksS = new Map<str, UBlockGetDTO>([
  ['data1', { type: 'TEXT', data: 'initial data' }],
  ['data2', { type: 'TEXT', data: 'd' }],
  ['data4', { type: 'TEXT', data: '' }],
  ['file1', { type: 'FILE', data: '' }],
  ['file2', { type: 'FILE', data: 'http://uni.com/static/complex--name--uuid.pdf' }],
  ['audio1', { type: 'AUDIO', data: hospitalMp3 }],
  ['audio2', { type: 'AUDIO', data: '' }],
  ['image1', { type: 'IMAGE', data: hospitalPng }],
  ['image2', { type: 'IMAGE', data: '' }],
  ['input1', { type: 'INPUT', data: JSON.stringify(eq) }],
  ['textarea1', { type: 'TEXTAREA', data: JSON.stringify(eq) }],
  ['checks1', { type: 'CHECKS', data: JSON.stringify(eq) }],
  ['radio1', { type: 'RADIO', data: JSON.stringify(eq) }],
  ['page1', { type: 'PAGE', data: '' }],
  ['page2', { type: 'PAGE', data: JSON.stringify(['data4', 'data2']) }],
  ['page3', { type: 'PAGE', data: JSON.stringify(['data2']) }],
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocksFileUploadS(body?: any) {
  if (body?.file?.name.includes('.mp3')) return hospitalMp3
  if (body?.file?.name.includes('.png')) return hospitalPng
  return 'http://uni.com/static/complex--name--uuid.pdf'
}
