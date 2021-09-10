import { UBlockDTO } from '../components/editing/types'
import { UAudioFileDTO } from '../components/editing/UFile/UAudioFile/UAudioFile'
import { UImageFileDTO } from '../components/editing/UFile/UImageFile/UImageFile'
import { UPageDataDTO } from '../components/editing/UPage/UPage'
import { str } from '../utils/types'

type IdANdBlock = [str, UBlockDTO]
export type IdANdBlocks = IdANdBlock[]
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
  ],
}

const mp3: UAudioFileDTO = { src: '/src/content/fluffy.mp3' }
const img: UImageFileDTO = { src: '/src/content/fluffy.jpg', width: 0 }
const newCatFile = { name: '', src: '' }
const pdf = {
  name: 'cat needs.pdf',
  src: 'https://firebasestorage.googleapis.com/v0/b/universe-55cec.appspot.com/o/cat%20needs.pdf?alt=media&token=231eb8fb-eb37-4461-bb67-66742a8f0da8',
}

export const _kittensBlocks: IdANdBlocks = [
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
