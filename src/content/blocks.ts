import { imageFromSrc } from '../utils/filesManipulation'
import { CalloutData, CodeData, UBlock, UTableData } from '../components/editing/UPage/ublockTypes'
import { _generators } from '../components/editing/UPage/UPageState/crdtParser/_fakeUPage'
import { str } from '../utils/types'

const {
  mcq,
  scq,
  saq,
  inEx,
  b,
  code,
  audio,
  file,
  t,
  h1,
  h2,
  h3,
  list,
  l,
  p,
  grid,
  subq,
  ex,
  image,
  video,
  q,
  cal,
  div,
  eq,
  table,
} = _generators

const _kittens = `A kitten is a juvenile cat. After being born, kittens display primary altriciality and are totally dependent on their mother for survival. They do not normally open their eyes until after seven to ten days. After about two weeks, kittens quickly develop and begin to explore the world outside the nest. After a further three to four weeks, they begin to eat solid food and grow adult teeth. Domestic kittens are highly social animals and usually enjoy human companionship.`
const _kittens2 = `A feline litter usually consists of two to five kittens born after a gestation lasting between 64 and 67 days, with an average length of 66 days, but from one to more than ten are known.
Kittens emerge in a sac called the amnion, which is bitten off and eaten by the mother cat.`
const _kittens3 = `Kittens develop very quickly from about two weeks of age until their seventh week.
Their coordination and strength improves. Kittens play-fight with their litter-mates and begin to explore the world outside the nest or den. They learn to wash themselves and others as well as play hunting and stalking games, showing their inborn ability as predators. These innate skills are developed by the kittens' mother or other adult cats, who bring live prey to the nest. Later, the mother demonstrate hunting techniques for the kittens to emulate.
As they reach three to four weeks old, the kittens are gradually weaned and begin to eat solid food, with weaning usually complete by six to eight weeks.`
const _kittens4 = `Kittens are highly social animals and spend most of their waking hours interacting with available animals and playing on their own. Play with other kittens peaks in the third or fourth month after birth, with more solitary hunting and stalking play peaking later, at about five months.`
const _equation = 'i\\hbar {\\frac {\\partial }{\\partial t}}|\\psi (t)\\rangle ={\\hat {H}}|\\psi (t)\\rangle'
const fallingCats = `Journal Of The American Veterinary Medical Association looked at 132 cats that had fallen an average of 5.5 storeys <code data-id="2" contenteditable="false">h_{total} \\approx 5.5 * 2.5 = 13.77m</code> and survived. It found that a third of them would have died without emergency veterinary treatment. Interestingly, injuries were worse in falls less than seven storeys than in higher tumbles. The researchers think that this is because the cats reach their terminal velocity <code data-id="1" contenteditable="false">V_{t}=\\sqrt{\\frac{2 m g}{\\rho A C_{d}}}</code> after falling about seven storeys (21m), which means they stop accelerating. They then relax, allowing better distribution of impact.`
const goodQuestion = `A good question: <i>Why are there no <em class="green-b">green</em> or <em class="blue-b">blue</em> colored cats?</i>`
const goodQuestionAnswer = `<mark>Andrew's answer:</mark> It’s not just cats. Mammals, in general, have never really figured out how to make a good <em class="green">green</em> or <em class="blue">blue</em> colored fur. Actual green or blue pigments are surprisingly rare in animals. Most of the blue colors that we see in creatures like birds or butterflies are actually <u>structural colors</u>, microscopic structures which are just the right size to absorb non-blue wavelengths of lights while reflecting blue, but it appears that evolution has never figured out how to make that method compatible with hair. <a href="https://qr.ae/pG3XBt" target="_blank">Learn more</a>`
export const _catQuote = `<b>“As anyone who has ever been around a cat for any length of time well knows, cats have enormous patience with the limitations of the humankind.”</b>
- <i>Cleveland Amory</i>`
const _calt =
  'Kittens are vulnerable because they like to find dark places to hide, sometimes with fatal results if they are not watched carefully.'
const callout: CalloutData = { text: _calt, type: 'warning' }
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
export const _catCode: CodeData = { text: _codeWithPaws, language: 'TypeScript' }

const fluffyAudio = audio('src/content/fluffy.mp3', 'fluffy.mp3')
const fluffyImg = image('src/content/fluffy.jpg', 450, 'fluffy.jpg')
const fluffyVideo = video('y8kTYCex8RU', 600)
const fluffyPdf = file('/src/content/catneeds.pdf', 'cat needs.pdf', 'catneeds.pdf')

export const _catTable: UTableData = [
  {
    rows: [
      'Breed',
      'The Ashera',
      'Savannah',
      'Bengal',
      'Persian',
      'Peterbald',
      'Sphynx',
      'Scottish Fold',
      'Russian Blue',
      'American Curl',
      'American Wirehair',
      'British Shorthair',
      'Maine Coon',
    ],
    width: 230,
  },
  {
    rows: [
      'Cost',
      'Up to $125,000',
      '$50,000',
      '$25,000',
      '$5,500',
      '$5,000',
      '$3,000',
      '$3,000',
      '$3,000',
      '$1,200',
      '$1,200',
      '$800 to $1,000',
      '$1,000',
    ],
    width: 190,
  },
]

const bathYourCat = t('Bath your cat')
const bathYourCatList = list(
  '.',
  l('Gather your supplies'),
  l('Rinse your cat'),
  l('Lather your cat with shampoo'),
  l('Rinse your cat again'),
  l('Clean the face'),
)

const healthyCat = t('Keep your cat healthy')
const healthyCatList = list(
  '>',
  l('How to keep your cat healthy', [
    l('Brush your cat every day'),
    l('Do not feed your cat too much dry food'),
    l("Pay Attention to Your Pet's Thirst"),
  ]),
  l('Signs & Symptoms of unhealthy cat', [
    l('Sudden change in mood'),
    l('No inclination to play or appearing lethargic'),
    l('Much less or much more vocal than usual'),
  ]),
)

const whyOwnCat = t('Why you should own a cat')
const whyOwnCatList = list(
  '*',
  l('Cats can bathe themselves'),
  l('Cats will keep your house and yard rodent-free'),
  l('Cats are low-maintenance and independent'),
  l('Cats are an eco-friendly pet choice'),
  l('Cats can help reduce stress'),
)

const hypoallergenicCat = t('Best hypoallergenic cat breeds')
const hypoallergenicCatList = list(
  '*',
  l('Balinese', undefined, true),
  l('Oriental Short Hair', undefined, true),
  l('Devon Rex', undefined, true),
  l('Sphynx', undefined, true),
  l('Siberian', undefined, true),
)

const catsGrid = grid(
  [
    [bathYourCat, bathYourCatList, b(), healthyCat, healthyCatList],
    [whyOwnCat, whyOwnCatList, b(), hypoallergenicCat, hypoallergenicCatList],
  ],
  ['45%', '55%'],
)

const catsLinksGrid = grid(
  [
    [p('how-to-grow-a-kitten'), p('cats-vs-dogs')],
    [p('pets-evolution'), p('how-pets-changed-humanity')],
  ],
  ['50%', '50%'],
)

export const _fq1SCQ = scq(
  'What is the proper term for a group of kittens?',
  ['kindle'],
  ['kaboodle', 'kine', 'kindle', 'kettle'],
  'The proper term for a group of kittens is a kindle, litter or intrigue.',
)

export const _fq2MCQ = mcq(
  'Why do cats rub against you?',
  ['To say hello', 'To show affiliation'],
  ['To say hello', 'They are itched', 'To show affiliation', 'They are stressed'],
  'It is an affectionate gesture that can also be used as a form of greeting.',
)

export const _fq3SAQ = saq('What breed of domestic cat has the longest fur?', 'Persian')

export const _fq4Ie = inEx(
  'A male cat is probably ',
  subq(0, '_', ['sterile'], 'He is born with an extra X chromosome that cats receive from their mother} or just nice'),
  ', if he is both orange and black\n\nIn ',
  subq(1, '(', ['New Zealand'], 'New Zealand leads the world with an average of 1.8 cats per household', [
    'USA ',
    'Denmark',
    'New Zealand',
  ]),
  'there are more cats per person than any other country in the world\nThe ',
  subq(2, '[', ['Puma', 'Catamount'], '', ['Puma ', 'Bay cat', 'Catamount']),
  ' is another name for the cougar?',
)

const fuzzyQuiz = ex('Fuzzy quiz', [_fq1SCQ, _fq2MCQ, _fq3SAQ, _fq4Ie])

const fallingCatsShort1 = `cats <code data-id="2" contenteditable="false">h_{total} \\approx 5.5 * 2.5 = 13.77m</code> and`
const fallingCatsShort3 = `nice <code data-id="666" contenteditable="false">E=mc^2</code> small <code data-id="2" contenteditable="false">E=mc^2</code> cat`

const _kittensS = `A <b><i>kitten</i></b> is a juvenile cat. After being born`
const _kittens2S = `A feline litter usually consists of two to five kittens born after a gestation lasting`
const _kittens3S = `Kittens develop very quickly from about two`
const _kittens4S = `Kittens are highly social animals and spend`

const catListsColumns = grid(
  [
    [bathYourCat, t('Gather your supplies'), t('Rinse your cat')],
    [whyOwnCat, t('Cats can bathe themselves'), t('Cats will keep your house and yard rodent-free')],
  ],
  ['50%', '50%'],
)

const fuzzyQuizShort = ex('Fuzzy quiz', [_fq1SCQ, _fq2MCQ, _fq3SAQ])
const quizWith1InlineExercise = ex('Test', [_fq4Ie])
const quizWith1InputField = ex('Test', [_fq3SAQ])

type IdAndBlocks = { [key: str]: UBlock }

const pets: IdAndBlocks = {
  catQuote: q(_catQuote),
  catsLinksGrid,
  kittensH1: h1('Kittens'),
  kittens1: t(_kittens),
  fluffyImg,
  kittensH2: h2('Development'),
  kittens2: t(_kittens2),
  kittens3: t(_kittens3),
  kittensH3: h3('Sociality'),
  kittens4: t(_kittens4),
  catCal: cal(callout.text, 'w'),
  d1: div(),
  goodQuestion: t(goodQuestion),
  goodQuestionAnswer: t(goodQuestionAnswer),
  d2: div(),
  fallingCats: t(fallingCats),
  empty: t(),
  videoText: t('Watch a short documentary about a small cat'),
  fluffyVideo,
  fuzzyQuiz,
  info: t('<b><i>Useful information</i></b>'),
  fluffyAudio,
  fluffyPdf,
  catsGrid,
  catTable: table(_catTable),
  waveEquation: eq(_equation),
  catCode: code(_catCode.text, _catCode.language),
}

const test: IdAndBlocks = {
  fallingCatsShort1: t(fallingCatsShort1),
  fallingCatsShort3: t(fallingCatsShort3),
  kittensHL: h1('Kittens Kittens Kittens Kittens'),
  kittensS: t(_kittensS),
  newCatFile: file(),
  kittensH2L: h2('Development Development Development'),
  kittens2S: t(_kittens2S),
  kittens3S: t(_kittens3S),
  kittensH3L: h3('Sociality Sociality Sociality Sociality'),
  kittens4S: t(_kittens4S),
  fatCode: code('I want to dance with a fat cat'),
  catListsColumns,
  fuzzyQuizShort,
  quizWith1InlineExercise,
  quizWith1InputField,
  bathYourCat,
  bathYourCatList,
  whyOwnCat,
  whyOwnCatList,
  healthyCat,
  healthyCatList,
  hypoallergenicCat,
  hypoallergenicCatList,
}

export const _blocks = { test, pets }

export const _fluffyBlob = () => imageFromSrc('src/content/fluffy.jpg')

// export const _kittensForLists: IdAndBlocks = [['petsForFocus', { type: 'page', data: $(_kittensForListsPage) }]]
