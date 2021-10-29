import { UAudioFileDTO } from '../components/editing/UFile/UAudioFile/UAudioFile'
import { UImageFileDTO } from '../components/editing/UFile/UImageFile/UImageFile'
import { UPageDataDTO } from '../components/editing/UPage/UPage'
import { str } from '../utils/types'
import { IdAndBlocks } from './types'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'
import { Question } from '../components/studying/training/types'
import { UBlockDTO } from '../components/editing/types'
import { imageFromSrc } from '../utils/filesManipulation'
import { CalloutDTO } from '../components/editing/UText/Callout/Callout'
import { CodeDTO } from '../components/editing/UText/Code/Code'

const $ = JSON.stringify

export const _fluffyBlob = () => imageFromSrc(fluffyJpg)

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
    'catQuote',
    'kittensH',
    'kittens',
    'fluffyJpg',
    'kittensH2',
    'kittens2',
    'kittens3',
    'kittensH3',
    'kittens4',
    'catCallout',
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
    'catCode',
  ],
}

const mp3: UAudioFileDTO = { src: fluffyMp3 }
const img: UImageFileDTO = { src: fluffyJpg, width: 900 }
const newCatFile = { name: '', src: '' }
const pdf = {
  name: 'cat needs.pdf',
  src: '/src/content/catneeds.pdf',
}
const quote = `<b>“As anyone who has ever been around a cat for any length of time well knows, cats have enormous patience with the limitations of the humankind.”</b>
– <i>Cleveland Amory</i>`
const _calt =
  'Kittens are vulnerable because they like to find dark places to hide, sometimes with fatal results if they are not watched carefully.'
const callout: CalloutDTO = { text: _calt, type: 'warning' }
export const _codeWithPaws = `import { useFluffiness } from 'catverse'

interface Kitty {
  cuteness: 'high' | 'very high'
  roundness: number
}

// Displays a nice kitten
export function Kitty({ cuteness, roundness = 0.99 }: Kitty) {
  const params = useFluffiness(cuteness, roundness)
  if (roundness === 1) console.info('You want an impossible kitty, but we will try')
  return (
    <FluffyBall params={params}>
      <Head />
      <Body>
        <LittlePaws />
      </Body>
      <Tail />
    </FluffyBall>
  )
}`

const catCode: CodeDTO = { code: _codeWithPaws, language: 'TypeScript' }

export const _kittensBlocks: IdAndBlocks = [
  ['catCode', { type: 'code', data: $(catCode) }],
  ['catCallout', { type: 'callout', data: $(callout) }],
  ['catQuote', { type: 'quote', data: quote }],
  ['kittensH', { type: 'heading1', data: 'Kittens' }],
  ['kittens', { type: 'text', data: _kittens }],
  ['fluffyJpg', { type: 'image', data: $(img) }],
  ['kittensH2', { type: 'heading2', data: 'Development' }],
  ['kittens2', { type: 'text', data: _kittens2 }],
  ['kittens3', { type: 'text', data: _kittens3 }],
  ['kittensH3', { type: 'heading3', data: 'Sociality' }],
  ['kittens4', { type: 'text', data: _kittens4 }],
  ['catPdf', { type: 'file', data: $(pdf) }],
  ['fluffyMp3', { type: 'audio', data: $(mp3) }],
  ['newCatFile', { type: 'file', data: $(newCatFile) }],
  ['pets', { type: 'page', data: $(page) }],
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

export const _idsForCodeFocus = ['hypoallergenic-cat', 'catCode', 'why-own-cat']

export const _kittensForFocus: IdAndBlocks = [
  ['kittensHL', { type: 'heading1', data: 'Kittens Kittens Kittens' }],
  ['kittensS', { type: 'text', data: _kittensS }],
  ['kittensH2L', { type: 'heading2', data: 'Development Development' }],
  ['kittens2S', { type: 'text', data: _kittens2S }],
  ['kittens3S', { type: 'text', data: _kittens3S }],
  ['kittensH3L', { type: 'heading3', data: 'Sociality Sociality Sociality Sociality' }],
  ['kittens4S', { type: 'text', data: _kittens4S }],
  ['kittensInfo', { type: 'text', data: '<b><i>Useful information</i></b>' }],
  ['petsForFocus', { type: 'page', data: $(_kittensForFocusPage) }],
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
  ['bath-your-cat', { type: 'text', data: 'Bath your cat' }],
  ['bath-your-cat-step1', { type: 'numbered-list', data: l('Gather your supplies') }],
  ['bath-your-cat-step2', { type: 'numbered-list', data: l('Rinse your cat') }],
  ['bath-your-cat-step3', { type: 'numbered-list', data: l('Lather your cat with shampoo') }],
  ['bath-your-cat-step4', { type: 'numbered-list', data: l('Rinse your cat again') }],
  ['bath-your-cat-step5', { type: 'numbered-list', data: l('Clean the face') }],
  ['why-own-cat', { type: 'text', data: 'Why you should own a cat' }],
  ['why-own-cat-point1', { type: 'bullet-list', data: l('Cats can bathe themselves') }],
  ['why-own-cat-point2', { type: 'bullet-list', data: l('Cats will keep your house and yard rodent-free') }],
  ['why-own-cat-point3', { type: 'bullet-list', data: l('Cats are low-maintenance and independent') }],
  ['why-own-cat-point4', { type: 'bullet-list', data: l('Cats are an eco-friendly pet choice') }],
  ['why-own-cat-point5', { type: 'bullet-list', data: l('Cats can help reduce stress') }],
  ['hypoallergenic-cat', { type: 'text', data: 'Best hypoallergenic cat breeds' }],
  ['hypoallergenic-cat1', { type: 'list', data: l('Balinese') }],
  ['hypoallergenic-cat2', { type: 'list', data: l('Oriental Short Hair') }],
  ['hypoallergenic-cat3', { type: 'list', data: l('Devon Rex') }],
  ['hypoallergenic-cat4', { type: 'list', data: l('Sphynx') }],
  ['hypoallergenic-cat5', { type: 'list', data: l('Siberian') }],
  ['petsForFocus', { type: 'page', data: $(_kittensForListsPage) }],
]

const q_ = (qe = '', ca = [''], o = [''], e = ''): Question => ({
  question: qe,
  correctAnswer: ca,
  options: o,
  explanation: e,
})

const q = (qe = '', ca = [''], o = [''], e = ''): str => $(q_(qe, ca, o, e))

export const _fuzzyQuiz: UBlockDTO = {
  type: 'exercise',
  data: $({ name: 'Fuzzy quiz', ids: ['fq-q1', 'fq-q2', 'fq-q3'] }),
}

const inlineQ1 = `If a male cat is both orange and black, he is probably {sterile} or just nice?
In {() USA (*) New Zealand () Denmark} there are more cats per person than any other country in the world
The {[*] Puma [] Bay cat [*] Catamount} is another name for the cougar?`
const inlineQ1E = `1. Sterile. Both of these colors are carried on the female X chromosome that cats receive from their mother. As a result a male cat is born with an extra X
2. New Zealand leads the world with an average of 1.8 cats per household
3. Other names for the cougar include puma, mountain lion, Florida panther, red tiger and catamount.`

export const _kittensQuiz: IdAndBlocks = [
  [
    'fq-q1',
    {
      type: 'radio',
      data: q(
        'What is the proper term for a group of kittens?',
        ['kindle'],
        ['kaboodle', 'kine', 'kindle', 'kettle'],
        'The proper term for a group of kittens is a kindle, litter or intrigue.',
      ),
    },
  ],
  [
    'fq-q2',
    {
      type: 'checks',
      data: q(
        'Why do cats rub against you?',
        ['To say hello', 'To show affiliation'],
        ['To say hello', 'They are itched', 'To show affiliation', 'They are stressed'],
        'It is an affectionate gesture that can also be used as a form of greeting.',
      ),
    },
  ],
  [
    'fq-q3',
    {
      type: 'input',
      data: q('What breed of domestic cat has the longest fur?', ['Persian'], [], ''),
    },
  ],
  [
    'fq-q4',
    {
      type: 'inline-question',
      data: q(inlineQ1, [], [], inlineQ1E),
    },
  ],
  ['fq', _fuzzyQuiz],
]
