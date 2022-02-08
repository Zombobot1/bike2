import { str } from '../utils/types'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'
import { imageFromSrc } from '../utils/filesManipulation'
import { CodeData, UBlock, UBlocks } from '../components/editing/UPage/types'

const $ = JSON.stringify

export const _fluffyBlob = () => imageFromSrc(fluffyJpg)

const fallingCatsShort1 = `cats <code data-id="2" contenteditable="false">h_{total} \\approx 5.5 * 2.5 = 13.77m</code> and`
const fallingCatsShort3 = `nice <code data-id="666" contenteditable="false">E=mc^2</code> small <code data-id="2" contenteditable="false">E=mc^2</code> cat`
const codeForFocus: CodeData = { code: 'I want to dance with a fat cat', language: 'Text' }

export const _kittensBlocks: IdAndBlocks = [
  ['pets', { type: 'page', data: $(page) }],
  ['fallingCatsShort1', { type: 'text', data: fallingCatsShort1 }],
  ['fallingCatsShort3', { type: 'text', data: fallingCatsShort3 }],
  ['divider', { type: 'divider', data: '' }],
  [],
  [''],
]

const _kittensS = `A <b><i>kitten</i></b> is a juvenile cat. After being born`
const _kittens2S = `A feline litter usually consists of two to five kittens born after a gestation lasting`
const _kittens3S = `Kittens develop very quickly from about two`
const _kittens4S = `Kittens are highly social animals and spend`

const kittensHL: UBlock = { id: 'kittensHL', type: 'heading-1', data: 'Kittens Kittens Kittens Kittens' }
const kittensS: UBlock = { id: 'kittensS', type: 'text', data: _kittensS }
const newCatFile: UBlock = { id: 'newCatFile', type: 'file', data: '' }
const kittensH2L: UBlock = { id: 'kittensH2L', type: 'heading-2', data: 'Development Development Development' }
const kittens2S: UBlock = { id: 'kittens2S', type: 'text', data: _kittens2S }
const kittens3S: UBlock = { id: 'kittens3S', type: 'text', data: _kittens3S }
const kittensH3L: UBlock = { id: 'kittensH3L', type: 'heading-3', data: 'Sociality Sociality Sociality Sociality' }
const kittens4S: UBlock = { id: 'kittens4S', type: 'text', data: _kittens4S }

export const _kittensForFocusPage: UBlocks = [
  kittensHL,
  kittensS,
  newCatFile,
  kittensH2L,
  kittens2S,
  kittens3S,
  kittensH3L,
  { id: 'codeForFocus', type: 'code', data: $(codeForFocus) },
  kittens4S,
]

const petsTestPage: UPageDTO = {
  color: '#0066FF',
  name: 'Pets & animals',
  ids: _kittensForFocusPage.ids,
}

const petsTestSmallPage: UPageDTO = {
  color: '#0066FF',
  name: 'Pets & animals',
  ids: ['emptyString'],
}

export const _kittensForFocus: IdAndBlocks = [
  ['petsForFocus', { type: 'page', data: $(_kittensForFocusPage) }],
  ['pets-test', { type: 'page', data: $(petsTestPage) }],
  ['pets-test-small', { type: 'page', data: $(petsTestSmallPage) }],
]

export const _kittensForListsPage: UPageDTO = {
  color: '',
  name: 'Pets',
  ids: [
    'bath-your-cat',
    'bath-your-cat-list',
    'why-own-cat',
    'why-own-cat-list',
    'healthy-cat',
    'healthy-cat-list',
    'hypoallergenic-cat',
    'hypoallergenic-cat-list',
  ],
}

export const _idsForCodeFocus = ['hypoallergenic-cat', 'catCode', 'why-own-cat']
export const _idsForBuildColumns = [
  'bath-your-cat',
  'bath-your-cat-step1',
  'bath-your-cat-step2',
  'why-own-cat',
  'why-own-cat-point1',
  'why-own-cat-point2',
]

export const _kittensForLists: IdAndBlocks = [['petsForFocus', { type: 'page', data: $(_kittensForListsPage) }]]
