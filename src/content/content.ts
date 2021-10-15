import { UAudioFileDTO } from '../components/editing/UFile/UAudioFile/UAudioFile'
import { UImageFileDTO } from '../components/editing/UFile/UImageFile/UImageFile'
import { UPageDataDTO } from '../components/editing/UPage/UPage'
import { str } from '../utils/types'
import { IdAndBlocks } from './types'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'

const $ = JSON.stringify

const _kittens = `A kitten is a juvenile cat. After being born, kittens display primary altriciality and are totally dependent on their mother for survival. They do not normally open their eyes until after seven to ten days. After about two weeks, kittens quickly develop and begin to explore the world outside the nest. After a further three to four weeks, they begin to eat solid food and grow adult teeth. Domestic kittens are highly social animals and usually enjoy human companionship.`
const _kittens2 = `A feline litter usually consists of two to five kittens born after a gestation lasting between 64 and 67 days, with an average length of 66 days, but from one to more than ten are known.
Kittens emerge in a sac called the amnion, which is bitten off and eaten by the mother cat.`
const _kittens3 = `Kittens develop very quickly from about two weeks of age until their seventh week.
Their coordination and strength improves. Kittens play-fight with their litter-mates and begin to explore the world outside the nest or den. They learn to wash themselves and others as well as play hunting and stalking games, showing their inborn ability as predators. These innate skills are developed by the kittens' mother or other adult cats, who bring live prey to the nest. Later, the mother demonstrate hunting techniques for the kittens to emulate.
As they reach three to four weeks old, the kittens are gradually weaned and begin to eat solid food, with weaning usually complete by six to eight weeks.`
const _kittens4 = `Kittens are highly social animals and spend most of their waking hours interacting with available animals and playing on their own. Play with other kittens peaks in the third or fourth month after birth, with more solitary hunting and stalking play peaking later, at about five months.`

const page: UPageDataDTO = {
  color: '#0066FF',
  name: 'Pets & animals',
  ids: [
    'kittensH',
    'kittens',
    'fluffyJpg',
    'kittensH2',
    'kittens2',
    'kittens3',
    'kittensH3',
    'kittens4',
    'catPdf',
    'fluffyMp3',
    'newCatFile',
    'kittensInfo',
    'bath-your-cat',
    'bath-your-cat-step1',
    'bath-your-cat-step2',
    'bath-your-cat-step3',
    'bath-your-cat-step4',
    'bath-your-cat-step5',
    'why-own-cat',
    'why-own-cat-point1',
    'why-own-cat-point2',
    'why-own-cat-point3',
    'why-own-cat-point4',
    'why-own-cat-point5',
    'hypoallergenic-cat',
    'hypoallergenic-cat1',
    'hypoallergenic-cat2',
    'hypoallergenic-cat3',
    'hypoallergenic-cat4',
    'hypoallergenic-cat5',
  ],
}

const mp3: UAudioFileDTO = { src: fluffyMp3 }
const img: UImageFileDTO = { src: fluffyJpg, width: 900 }
const newCatFile = { name: '', src: '' }
const pdf = {
  name: 'cat needs.pdf',
  src: '/src/content/catneeds.pdf',
}

export const _kittensBlocks: IdAndBlocks = [
  ['kittensH', { type: 'HEADING1', data: 'Kittens' }],
  ['kittens', { type: 'TEXT', data: _kittens }],
  ['fluffyJpg', { type: 'IMAGE', data: $(img) }],
  ['kittensH2', { type: 'HEADING2', data: 'Development' }],
  ['kittens2', { type: 'TEXT', data: _kittens2 }],
  ['kittens3', { type: 'TEXT', data: _kittens3 }],
  ['kittensH3', { type: 'HEADING3', data: 'Sociality' }],
  ['kittens4', { type: 'TEXT', data: _kittens4 }],
  ['catPdf', { type: 'FILE', data: $(pdf) }],
  ['fluffyMp3', { type: 'AUDIO', data: $(mp3) }],
  ['newCatFile', { type: 'FILE', data: $(newCatFile) }],
  ['pets', { type: 'PAGE', data: $(page) }],
]

const _kittensS = `A <b><i>kitten</i></b> is a juvenile cat. After being born`
const _kittens2S = `A feline litter usually consists of two to five kittens born after a gestation lasting between 64 and 67 days, with an average`
const _kittens3S = `Kittens develop very quickly from about two weeks of age until their seventh week. Their coordination and strength`
const _kittens4S = `Kittens are highly social animals and spend most of their `

export const _kittensForFocusPage: UPageDataDTO = {
  color: '',
  name: 'Pets',
  ids: ['kittensHL', 'kittensS', 'newCatFile', 'kittensH2L', 'kittens2S', 'kittens3S', 'kittensH3L', 'kittens4S'],
  // ids: ['kittensHL', 'kittensS'],
}

export const _kittensForFocus: IdAndBlocks = [
  ['kittensHL', { type: 'HEADING1', data: 'Kittens Kittens Kittens' }],
  ['kittensS', { type: 'TEXT', data: _kittensS }],
  ['kittensH2L', { type: 'HEADING2', data: 'Development Development' }],
  ['kittens2S', { type: 'TEXT', data: _kittens2S }],
  ['kittens3S', { type: 'TEXT', data: _kittens3S }],
  ['kittensH3L', { type: 'HEADING3', data: 'Sociality Sociality Sociality Sociality' }],
  ['kittens4S', { type: 'TEXT', data: _kittens4S }],
  ['kittensInfo', { type: 'TEXT', data: 'Useful information' }],
  ['petsForFocus', { type: 'PAGE', data: $(_kittensForFocusPage) }],
]

export const _kittensForListsPage: UPageDataDTO = {
  color: '',
  name: 'Pets',
  ids: [
    'bath-your-cat',
    'bath-your-cat-step1',
    'bath-your-cat-step2',
    'why-own-cat',
    'why-own-cat-point1',
    'why-own-cat-point2',
    'hypoallergenic-cat',
    'hypoallergenic-cat1',
    'hypoallergenic-cat2',
  ],
}

const l = (t: str, o = 1): str => $({ text: t, offset: o })
export const _kittensForLists: IdAndBlocks = [
  ['bath-your-cat', { type: 'TEXT', data: 'Bath your cat' }],
  ['bath-your-cat-step1', { type: 'NUMBERED_LIST', data: l('Gather your supplies') }],
  ['bath-your-cat-step2', { type: 'NUMBERED_LIST', data: l('Rinse your cat') }],
  ['bath-your-cat-step3', { type: 'NUMBERED_LIST', data: l('Lather your cat with shampoo') }],
  ['bath-your-cat-step4', { type: 'NUMBERED_LIST', data: l('Rinse your cat again') }],
  ['bath-your-cat-step5', { type: 'NUMBERED_LIST', data: l('Clean the face') }],
  ['why-own-cat', { type: 'TEXT', data: 'Why you should own a cat' }],
  ['why-own-cat-point1', { type: 'BULLET_LIST', data: l('Cats can bathe themselves') }],
  ['why-own-cat-point2', { type: 'BULLET_LIST', data: l('Cats will keep your house and yard rodent-free') }],
  ['why-own-cat-point3', { type: 'BULLET_LIST', data: l('Cats are low-maintenance and independent') }],
  ['why-own-cat-point4', { type: 'BULLET_LIST', data: l('Cats are an eco-friendly pet choice') }],
  ['why-own-cat-point5', { type: 'BULLET_LIST', data: l('Cats can help reduce stress') }],
  ['hypoallergenic-cat', { type: 'TEXT', data: 'Best hypoallergenic cat breeds' }],
  ['hypoallergenic-cat1', { type: 'LIST', data: l('Balinese') }],
  ['hypoallergenic-cat2', { type: 'LIST', data: l('Oriental Short Hair') }],
  ['hypoallergenic-cat3', { type: 'LIST', data: l('Devon Rex') }],
  ['hypoallergenic-cat4', { type: 'LIST', data: l('Sphynx') }],
  ['hypoallergenic-cat5', { type: 'LIST', data: l('Siberian') }],
  ['petsForFocus', { type: 'PAGE', data: $(_kittensForListsPage) }],
]
