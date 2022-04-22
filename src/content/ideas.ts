import { Bytes } from 'firebase/firestore'
import { InlineExerciseData } from '../components/editing/UPage/ublockTypes'
import { _generateTestUPage } from '../components/editing/UPage/UPageState/UPageState'
import { IdeaDTO, TrainingDTO, TrainingIndicators } from '../fb/FSSchema'
import { num, str } from '../utils/types'
import { isStr } from '../utils/utils'
import { _fq4Ie as _fq4Ie, _fq1SCQ, _fq2MCQ, _fq3SAQ } from './blocks'

const iDTO = (updates: Bytes[], upageId = 'pets-and-animals'): IdeaDTO => ({
  ownerId: 'cat-lover',
  upageId,
  updates,
})

const itDTO = (
  preview: str,
  upageId: str,
  dataId: str,
  createdAt: num,
  stageId: str,
  userId = 'cat-lover',
  ids = [''],
): TrainingDTO => ({
  userId,
  upageId,
  preview,
  ideaId: dataId,
  createdAt,
  repeatAt: 16e8,
  indicators: ids.map(
    (id): TrainingIndicators => ({
      id,
      failNumber: 0,
      repeatNumber: 0,
      priority: 'medium',
      repeatAt: 16e8,
      stageId,
      timeToAnswer: 60,
    }),
  ),
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
const idsFromIe = (ie: InlineExerciseData) =>
  ie.content.map((sq) => (!isStr(sq) ? sq.correctAnswer.join(', ') : '')).filter(Boolean)
const paa = 'pets-and-animals'
export const _ideaTrainingDTOs = [
  ['q1', itDTO('What is the proper term for a group of kittens?', paa, 'q1', 16e8, '')],
  ['q2', itDTO('Why do cats rub against you?', paa, 'q2', 162e7, 'day3-zuYt')],
  ['q3', itDTO('What breed of domestic cat has the longest fur?', paa, 'q3', 163e7, 'day15-wNC5')],
  [
    'q4',
    itDTO(
      'A male cat is probably __ if he is both orange and black',
      paa,
      'q4',
      164e7,
      'day30-U4WD',
      undefined,
      idsFromIe(_fq4Ie.data as InlineExerciseData),
    ),
  ],
]

export const _fakeIdeaDTOs = [
  ['fq1', iDTO(i1, 'english')],
  ['fq2', iDTO(i2, 'rules')], // in english
  ['fq3', iDTO(i3, 'english')],
  ['fq33', iDTO(i3, 'cats')], // top level
  ['fq4', iDTO(i4, 'cats')],
]
const c1 = 'cat-lover1'
export const _fakeIdeaTrainingDTOs = [
  ['fq1', itDTO('What is the proper term for a group of kittens?', 'english', 'q1', 16e8, '', c1)],
  ['fq2', itDTO('Why do cats rub against you?', 'rules', 'q2', 162e7, 'day3-zuYt', c1)],
  ['fq3', itDTO('What breed of domestic cat has the longest fur?', 'english', 'q3', 163e7, 'day15-wNC5', c1)],
  ['fq33', itDTO('What breed of domestic cat has the longest fur?', 'cats', 'q3', 163e7, 'day15-wNC5', c1)],
  [
    'fq4',
    itDTO(
      'A male cat is probably __ if he is both orange and black',
      'cats',
      'q4',
      164e7,
      'day30-U4WD',
      c1,
      idsFromIe(_fq4Ie.data as InlineExerciseData),
    ),
  ],
]
