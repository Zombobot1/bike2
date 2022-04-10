import { Bytes } from 'firebase/firestore'
import { _generateTestUPage } from '../components/editing/UPage/UPageState/UPageState'
import { IdeaDTO, TrainingDTO } from '../fb/FSSchema'
import { str } from '../utils/types'
import { _fq4Ie as _fq4Ie, _fq1SCQ, _fq2MCQ, _fq3SAQ } from './blocks'

const iDTO = (updates: Bytes[], upageId = 'pets-and-animals'): IdeaDTO => ({
  ownerId: 'cat-lover',
  upageId,
  updates,
})

const itDTO = (preview: str, dataId: str, createdAt: str, stageId: str): TrainingDTO => ({
  preview,
  dataId,
  createdAt,
  upageId: 'pets-and-animals',
  repeatAt: 16e8,
  idAndIndicators: { r: { errorRate: 0, priority: 'medium', repeatAt: 16e8, stageId, timeToAnswer: 60 } },
})

const i1 = _generateTestUPage({ ublocks: [_fq1SCQ] })
const i2 = _generateTestUPage({ ublocks: [_fq2MCQ] })
const i3 = _generateTestUPage({ ublocks: [_fq3SAQ] })
const i4 = _generateTestUPage({ ublocks: [_fq4Ie] })

export const _ideaDTOs = [
  ['q1', iDTO(i1)],
  ['q2', iDTO(i2)],
  ['q3', iDTO(i3)],
  ['q4', iDTO(i4)],
]

export const _ideaTrainingDTOs = [
  ['q1', itDTO('What is the proper term for a group of kittens?', 'q1', '01.12.21', '')],
  ['q2', itDTO('Why do cats rub against you?', 'q2', '21.11.21', 'day3-zuYt')],
  ['q3', itDTO('What breed of domestic cat has the longest fur?', 'q3', '10.10.21', 'day15-wNC5')],
  ['q4', itDTO('A male cat is probably __ if he is both orange and black', 'q4', '07.10.21', 'day30-U4WD')],
]

export const _fakeIdeaDTOs = [
  ['fq1', iDTO(i1, 'english')],
  ['fq2', iDTO(i2, 'rules')], // in english
  ['fq3', iDTO(i3, 'english')],
  ['fq33', iDTO(i3, 'cats')], // top level
  ['fq4', iDTO(i4, 'cats')],
]

export const _fakeIdeaTrainingDTOs = [
  ['fq1', itDTO('What is the proper term for a group of kittens?', 'fq1', '01.12.21', '')],
  ['fq2', itDTO('Why do cats rub against you?', 'fq2', '21.11.21', 'day3-zuYt')],
  ['fq3', itDTO('What breed of domestic cat has the longest fur?', 'fq3', '10.10.21', 'day15-wNC5')],
  ['fq33', itDTO('What breed of domestic cat has the longest fur?', 'fq33', '10.10.21', 'day15-wNC5')],
  ['fq4', itDTO('A male cat is probably __ if he is both orange and black', 'fq4', '07.10.21', 'day30-U4WD')],
]
