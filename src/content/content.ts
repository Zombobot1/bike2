import { UAudioFileDTO } from '../components/editing/UFile/UAudioFile/UAudioFile'
import { UMediaFileDTO } from '../components/editing/UFile/UImageFile/UImageFile'
import { UPageDTO } from '../components/editing/UPage/UPage'
import { str } from '../utils/types'
import { IdAndBlocks } from './types'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'
import { UBlockDTO, UGridDTO } from '../components/editing/types'
import { imageFromSrc } from '../utils/filesManipulation'
import { CalloutDTO } from '../components/editing/UText/Callout/Callout'
import { CodeDTO } from '../components/editing/UText/Code/Code'
import { UTableDTO } from '../components/editing/UTable/UTable'
import { InlineExerciseDTO, UChecksDTO, UInputDTO } from '../components/uforms/types'
import { UListDTO } from '../components/editing/UList/types'

const $ = JSON.stringify

export const _fluffyBlob = () => imageFromSrc(fluffyJpg)

const _kittens = `A kitten is a juvenile cat. After being born, kittens display primary altriciality and are totally dependent on their mother for survival. They do not normally open their eyes until after seven to ten days. After about two weeks, kittens quickly develop and begin to explore the world outside the nest. After a further three to four weeks, they begin to eat solid food and grow adult teeth. Domestic kittens are highly social animals and usually enjoy human companionship.`
const _kittens2 = `A feline litter usually consists of two to five kittens born after a gestation lasting between 64 and 67 days, with an average length of 66 days, but from one to more than ten are known.
Kittens emerge in a sac called the amnion, which is bitten off and eaten by the mother cat.`
const _kittens3 = `Kittens develop very quickly from about two weeks of age until their seventh week.
Their coordination and strength improves. Kittens play-fight with their litter-mates and begin to explore the world outside the nest or den. They learn to wash themselves and others as well as play hunting and stalking games, showing their inborn ability as predators. These innate skills are developed by the kittens' mother or other adult cats, who bring live prey to the nest. Later, the mother demonstrate hunting techniques for the kittens to emulate.
As they reach three to four weeks old, the kittens are gradually weaned and begin to eat solid food, with weaning usually complete by six to eight weeks.`
const _kittens4 = `Kittens are highly social animals and spend most of their waking hours interacting with available animals and playing on their own. Play with other kittens peaks in the third or fourth month after birth, with more solitary hunting and stalking play peaking later, at about five months.`
const _equation = 'i\\hbar {\\frac {\\partial }{\\partial t}}|\\psi (t)\\rangle ={\\hat {H}}|\\psi (t)\\rangle'
const fallingCats = `Journal Of The American Veterinary Medical Association looked at 132 cats that had fallen an average of 5.5 storeys <code data-id="2" contenteditable="false">h_{total} \\approx 5.5 * 2.5 = 13.77m</code> and survived. It found that a third of them would have died without emergency veterinary treatment. Interestingly, injuries were worse in falls less than seven storeys than in higher tumbles. The researchers think that this is because the cats reach their terminal velocity <code data-id="1" contenteditable="false">V_{t}=\\sqrt{\\frac{2 m g}{\\rho A C_{d}}}</code> after falling about seven storeys (21m), which means they stop accelerating. They then relax, allowing better distribution of impact.`
const fallingCatsShort1 = `cats <code data-id="2" contenteditable="false">h_{total} \\approx 5.5 * 2.5 = 13.77m</code> and`
// const fallingCatsShort2 = `cats reach their terminal velocity <code data-id="1" contenteditable="false">V_{t}=\\sqrt{\\frac{2 m g}{\\rho A C_{d}}}</code> after falling about seven storeys (21m), <code data-id="2" contenteditable="false">V_{t}=\\sqrt{\\frac{2 m g}{\\rho A C_{d}}}</code> which means they stop accelerating`
const fallingCatsShort3 = `nice <code data-id="666" contenteditable="false">E=mc^2</code> small <code data-id="2" contenteditable="false">E=mc^2</code> cat`
const goodQuestion = `A good question: <i>Why are there no <em class="green-b">green</em> or <em class="blue-b">blue</em> colored cats?</i>`
const goodQuestionAnswer = `<mark>Andrew's answer:</mark> It’s not just cats. Mammals, in general, have never really figured out how to make a good <em class="green">green</em> or <em class="blue">blue</em> colored fur. Actual green or blue pigments are surprisingly rare in animals. Most of the blue colors that we see in creatures like birds or butterflies are actually <u>structural colors</u>, microscopic structures which are just the right size to absorb non-blue wavelengths of lights while reflecting blue, but it appears that evolution has never figured out how to make that method compatible with hair. <a href="https://qr.ae/pG3XBt" target="_blank">Learn more</a>`

const goodQuestionBlocks: IdAndBlocks = [
  ['good-question-d1', { type: 'divider', data: '' }],
  ['good-question', { type: 'text', data: goodQuestion }],
  ['good-question-answer', { type: 'text', data: goodQuestionAnswer }],
  ['good-question-d2', { type: 'divider', data: '' }],
]

const catsGridData: UGridDTO = {
  columns: [
    ['bath-your-cat', 'bath-your-cat-list', 'e_s-0', 'healthy-cat', 'healthy-cat-list'],
    ['why-own-cat', 'why-own-cat-list', 'e_s-1', 'hypoallergenic-cat', 'hypoallergenic-cat-list'],
  ],
  widths: ['45%', '55%'],
  ids: ['c-g-1', 'c-g-2'],
}

const catsLinksGridData: UGridDTO = {
  columns: [
    ['grow-kitten', 'cats-vs-dogs'],
    ['how-pets-changed-humanity', 'pets-research'],
  ],
  widths: ['50%', '50%'],
  ids: ['c-l-g-1', 'c-l-g-2'],
}

const page: UPageDTO = {
  color: '#0066FF',
  name: 'Pets & animals',
  ids: [
    'catQuote',
    'cats-links-grid',
    'kittensH',
    'kittens',
    'fluffyJpg',
    'kittensH2',
    'kittens2',
    'kittens3',
    'kittensH3',
    'kittens4',
    'catCallout',
    'good-question-d1',
    'good-question',
    'good-question-answer',
    'good-question-d2',
    'fallingCats',
    'emptyString',
    'catVideoText',
    'catVideo',
    'fuzzy-quiz',
    'kittensInfo',
    'fluffyMp3',
    'catPdf',
    'cats-grid',
    'catTable',
    'waveEquation',
    'catCode',
  ],
}

const mp3: UAudioFileDTO = { src: fluffyMp3 }
const img: UMediaFileDTO = { src: fluffyJpg, width: 450 }
const video: UMediaFileDTO = { src: 'y8kTYCex8RU', width: 600 }

const newCatFile = { name: '', src: '' }
const pdf = {
  name: 'cat needs.pdf',
  src: '/src/content/catneeds.pdf',
}
const quote = `<b>“As anyone who has ever been around a cat for any length of time well knows, cats have enormous patience with the limitations of the humankind.”</b>
- <i>Cleveland Amory</i>`
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

const catTable: UTableDTO = {
  rows: [
    ['Breed', 'Cost'],
    ['The Ashera', 'Up to $125,000'],
    ['Savannah', '$50,000'],
    ['Bengal', '$25,000'],
    ['Persian', '$5,500'],
    ['Peterbald', '$5,000'],
    ['Sphynx', '$3,000'],
    ['Scottish Fold', '$3,000'],
    ['Russian Blue', '$3,000'],
    ['American Curl', '$1,200'],
    ['American Wirehair', '$1,200'],
    ['British Shorthair', '$800 to $1,000'],
    ['Maine Coon', '$1,000'],
  ],
  widths: [230, 190],
}

const catCode: CodeDTO = { code: _codeWithPaws, language: 'TypeScript' }
const codeForFocus: CodeDTO = { code: 'I want to dance with a fat cat', language: 'Text' }

const catP1: UPageDTO = { name: 'How to grow a kitten', color: '#0066FF', ids: [] }
const catP2: UPageDTO = { name: 'Cats vs Dogs', color: '#0066FF', ids: [] }
const catP3: UPageDTO = { name: 'Research papers about evolution of pets', color: '#0066FF', ids: [] }
const catP4: UPageDTO = { name: 'How pets changed humanity', color: '#0066FF', ids: [] }

const listsInColumns: UGridDTO = {
  widths: ['50%', '50%'],
  columns: [
    ['bath-your-cat', 'bath-your-cat-step1', 'bath-your-cat-step2'],
    ['why-own-cat', 'why-own-cat-point1', 'why-own-cat-point2'],
  ],
  ids: ['g-1', 'g-2'],
}

export const _kittensBlocks: IdAndBlocks = [
  ...goodQuestionBlocks,
  ['catVideoText', { type: 'text', data: 'Watch a short documentary about a small cat' }],
  ['catVideo', { type: 'video', data: $(video) }],
  ['catTable', { type: 'table', data: $(catTable) }],
  ['catCode', { type: 'code', data: $(catCode) }],
  ['catCallout', { type: 'callout', data: $(callout) }],
  ['catQuote', { type: 'quote', data: quote }],
  ['kittensH', { type: 'heading-1', data: 'Kittens' }],
  ['kittens', { type: 'text', data: _kittens }],
  ['fluffyJpg', { type: 'image', data: $(img) }],
  ['kittensH2', { type: 'heading-2', data: 'Development' }],
  ['kittens2', { type: 'text', data: _kittens2 }],
  ['kittens3', { type: 'text', data: _kittens3 }],
  ['kittensH3', { type: 'heading-3', data: 'Sociality' }],
  ['kittens4', { type: 'text', data: _kittens4 }],
  ['catPdf', { type: 'file', data: $(pdf) }],
  ['fluffyMp3', { type: 'audio', data: $(mp3) }],
  ['newCatFile', { type: 'file', data: $(newCatFile) }],
  ['pets', { type: 'page', data: $(page) }],
  ['waveEquation', { type: 'block-equation', data: _equation }],
  ['fallingCats', { type: 'text', data: fallingCats }],
  ['fallingCatsShort1', { type: 'text', data: fallingCatsShort1 }],
  ['fallingCatsShort3', { type: 'text', data: fallingCatsShort3 }],
  ['divider', { type: 'divider', data: '' }],
  ['grow-kitten', { type: 'page', data: $(catP1) }],
  ['cats-vs-dogs', { type: 'page', data: $(catP2) }],
  ['pets-research', { type: 'page', data: $(catP3) }],
  ['how-pets-changed-humanity', { type: 'page', data: $(catP4) }],
  ['cat-lists-columns', { type: 'grid', data: $(listsInColumns) }],
  ['cats-grid', { type: 'grid', data: $(catsGridData) }],
  ['cats-links-grid', { type: 'grid', data: $(catsLinksGridData) }],
]

const _kittensS = `A <b><i>kitten</i></b> is a juvenile cat. After being born`
const _kittens2S = `A feline litter usually consists of two to five kittens born after a gestation lasting`
const _kittens3S = `Kittens develop very quickly from about two`
const _kittens4S = `Kittens are highly social animals and spend`

export const _kittensForFocusPage: UPageDTO = {
  color: '',
  name: 'Pets',
  ids: [
    'kittensHL',
    'kittensS',
    'newCatFile',
    'kittensH2L',
    'kittens2S',
    'kittens3S',
    'kittensH3L',
    'codeForFocus',
    'kittens4S',
  ],
  // ids: ['kittensHL', 'kittensS'],
}

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
  ['kittensHL', { type: 'heading-1', data: 'Kittens Kittens Kittens Kittens' }],
  ['kittensS', { type: 'text', data: _kittensS }],
  ['kittensH2L', { type: 'heading-2', data: 'Development Development Development' }],
  ['kittens2S', { type: 'text', data: _kittens2S }],
  ['kittens3S', { type: 'text', data: _kittens3S }],
  ['kittensH3L', { type: 'heading-3', data: 'Sociality Sociality Sociality Sociality' }],
  ['kittens4S', { type: 'text', data: _kittens4S }],
  ['kittensInfo', { type: 'text', data: '<b><i>Useful information</i></b>' }],
  ['petsForFocus', { type: 'page', data: $(_kittensForFocusPage) }],
  ['codeForFocus', { type: 'code', data: $(codeForFocus) }],
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

const bathList: UListDTO = {
  id: 'bath-your-cat-list',
  children: [
    { id: 'bath-your-cat-step1' },
    { id: 'bath-your-cat-step2' },
    { id: 'bath-your-cat-step3' },
    { id: 'bath-your-cat-step4' },
    { id: 'bath-your-cat-step5' },
  ],
}

const whyOwnList: UListDTO = {
  id: 'why-own-cat-point-list',
  children: [
    { id: 'why-own-cat-point1' },
    { id: 'why-own-cat-point2' },
    { id: 'why-own-cat-point3' },
    { id: 'why-own-cat-point4' },
    { id: 'why-own-cat-point5' },
  ],
}

const healthyCatList: UListDTO = {
  id: 'healthy-cat-list',
  children: [
    {
      id: 'healthy-cat1',
      children: [{ id: 'healthy-cat11' }, { id: 'healthy-cat12' }, { id: 'healthy-cat13' }],
    },
    {
      id: 'unhealthy-cat1',
      children: [{ id: 'unhealthy-cat11' }, { id: 'unhealthy-cat12' }, { id: 'unhealthy-cat13' }],
    },
  ],
}

const hypoallergenicList: UListDTO = {
  id: 'hypoallergenic-cat-list',
  children: [
    { id: 'hypoallergenic-cat1', unmarked: true },
    { id: 'hypoallergenic-cat2', unmarked: true },
    { id: 'hypoallergenic-cat3', unmarked: true },
    { id: 'hypoallergenic-cat4', unmarked: true },
    { id: 'hypoallergenic-cat5', unmarked: true },
  ],
}

export const _kittensForLists: IdAndBlocks = [
  ['bath-your-cat', { type: 'text', data: 'Bath your cat' }],
  ['bath-your-cat-list', { type: 'numbered-list', data: $(bathList) }],
  ['bath-your-cat-step1', { type: 'text', data: 'Gather your supplies' }],
  ['bath-your-cat-step2', { type: 'text', data: 'Rinse your cat' }],
  ['bath-your-cat-step3', { type: 'text', data: 'Lather your cat with shampoo' }],
  ['bath-your-cat-step4', { type: 'text', data: 'Rinse your cat again' }],
  ['bath-your-cat-step5', { type: 'text', data: 'Clean the face' }],
  ['why-own-cat', { type: 'text', data: 'Why you should own a cat' }],
  ['why-own-cat-list', { type: 'bullet-list', data: $(whyOwnList) }],
  ['why-own-cat-point1', { type: 'text', data: 'Cats can bathe themselves' }],
  ['why-own-cat-point2', { type: 'text', data: 'Cats will keep your house and yard rodent-free' }],
  ['why-own-cat-point3', { type: 'text', data: 'Cats are low-maintenance and independent' }],
  ['why-own-cat-point4', { type: 'text', data: 'Cats are an eco-friendly pet choice' }],
  ['why-own-cat-point5', { type: 'text', data: 'Cats can help reduce stress' }],
  ['healthy-cat', { type: 'text', data: 'Keep your cat healthy' }],
  ['healthy-cat-list', { type: 'toggle-list', data: $(healthyCatList) }],
  ['healthy-cat1', { type: 'text', data: 'How to keep your cat healthy' }],
  ['healthy-cat11', { type: 'text', data: 'Brush your cat every day.' }],
  ['healthy-cat12', { type: 'text', data: 'Do not feed your cat too much dry food.' }],
  ['healthy-cat13', { type: 'text', data: "Pay Attention to Your Pet's Thirst." }],
  ['unhealthy-cat1', { type: 'text', data: 'Signs & Symptoms of unhealthy cat' }],
  ['unhealthy-cat11', { type: 'text', data: 'Sudden change in mood.' }],
  ['unhealthy-cat12', { type: 'text', data: 'No inclination to play or appearing lethargic.' }],
  ['unhealthy-cat13', { type: 'text', data: 'Much less or much more vocal than usual.' }],
  ['hypoallergenic-cat', { type: 'text', data: 'Best hypoallergenic cat breeds' }],
  ['hypoallergenic-cat-list', { type: 'bullet-list', data: $(hypoallergenicList) }],
  ['hypoallergenic-cat1', { type: 'text', data: 'Balinese' }],
  ['hypoallergenic-cat2', { type: 'text', data: 'Oriental Short Hair' }],
  ['hypoallergenic-cat3', { type: 'text', data: 'Devon Rex' }],
  ['hypoallergenic-cat4', { type: 'text', data: 'Sphynx' }],
  ['hypoallergenic-cat5', { type: 'text', data: 'Siberian' }],
  ['petsForFocus', { type: 'page', data: $(_kittensForListsPage) }],
]

const qc = (qe = '', ca = [''], o = [''], e = ''): str => {
  const q: UChecksDTO = { question: qe, options: o, correctAnswer: ca, explanation: e }
  return $(q)
}
const qi = (qe = '', ca = '', e = ''): str => {
  const q: UInputDTO = { question: qe, correctAnswer: ca, explanation: e }
  return $(q)
}

const _fuzzyQuiz: UBlockDTO = {
  type: 'exercise',
  data: $({ name: 'Fuzzy quiz', ids: ['fq-q1', 'fq-q2', 'fq-q3', 'fq-inline-exercise'] }),
}

export const _fuzzyQuizShort: UBlockDTO = {
  type: 'exercise',
  data: $({ name: 'Fuzzy quiz', ids: ['fq-q1', 'fq-q2', 'fq-q3'] }),
}

const _quizWith1InlineExercise: UBlockDTO = {
  type: 'exercise',
  data: $({ name: 'Test', ids: ['fq-inline-exercise'] }),
}

const _quizWith1InputField: UBlockDTO = {
  type: 'exercise',
  data: $({ name: 'Test', ids: ['fq-q3'] }),
}

const inlineExercise: InlineExerciseDTO = [
  'A male cat is probably ',
  {
    i: 0,
    correctAnswer: ['sterile'],
    explanation: 'He is born with an extra X chromosome that cats receive from their mother} or just nice',
    options: [],
    type: 'short-answer',
  },
  ', if he is both orange and black\n\nIn ',
  {
    i: 1,
    correctAnswer: ['New Zealand'],
    explanation: 'New Zealand leads the world with an average of 1.8 cats per household',
    options: ['USA ', 'Denmark', 'New Zealand'],
    type: 'single-choice',
  },
  'there are more cats per person than any other country in the world\nThe ',
  {
    i: 2,
    correctAnswer: ['Puma', 'Catamount'],
    explanation: '',
    options: ['Puma ', 'Bay cat', 'Catamount'],
    type: 'multiple-choice',
  },
  ' is another name for the cougar?',
]

export const _kittensQuiz: IdAndBlocks = [
  [
    'fq-q1',
    {
      type: 'single-choice',
      data: qc(
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
      type: 'multiple-choice',
      data: qc(
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
      type: 'short-answer',
      data: qi('What breed of domestic cat has the longest fur?', 'Persian'),
    },
  ],
  ['fq', _fuzzyQuizShort],
  ['fq-inline-exercise', { type: 'inline-exercise', data: $(inlineExercise) }],
  ['qw1e', _quizWith1InlineExercise],
  ['qw1i', _quizWith1InputField],
  ['fuzzy-quiz', _fuzzyQuiz],
]
