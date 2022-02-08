import {
  CalloutData,
  CodeData,
  UAudioFileData,
  UBlocks,
  UMediaFileData,
  UPageData,
  UTableData,
} from '../components/editing/UPage/types'
import { _catsGrid, _catsLinksGrid } from './gridsAndLists'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'
import { _es } from './types'
import { _fuzzyQuiz } from './catQuiz'

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
const quote = `<b>“As anyone who has ever been around a cat for any length of time well knows, cats have enormous patience with the limitations of the humankind.”</b>
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
const catCode: CodeData = { code: _codeWithPaws, language: 'TypeScript' }

const mp3: UAudioFileData = { src: fluffyMp3 }
const img: UMediaFileData = { src: fluffyJpg, width: 450 }
const video: UMediaFileData = { src: 'y8kTYCex8RU', width: 600 }

const pdf = {
  name: 'cat needs.pdf',
  src: '/src/content/catneeds.pdf',
}

const catTable: UTableData = {
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

const goodQuestionBlocks: UBlocks = [
  { id: 'good-question-d1', type: 'divider', data: '' },
  { id: 'good-question', type: 'text', data: goodQuestion },
  { id: 'good-question-answer', type: 'text', data: goodQuestionAnswer },
  { id: 'good-question-d2', type: 'divider', data: '' },
]

export const _catsPage: UPageData = {
  color: '#0066FF',
  name: 'Pets & animals',
  ublocks: [
    { id: 'catQuote', type: 'quote', data: quote },
    _catsLinksGrid,
    { id: 'kittensH', type: 'heading-1', data: 'Kittens' },
    { id: 'kittens', type: 'text', data: _kittens },
    { id: 'fluffyJpg', type: 'image', data: img },
    { id: 'kittensH2', type: 'heading-2', data: 'Development' },
    { id: 'kittens2', type: 'text', data: _kittens2 },
    { id: 'kittens3', type: 'text', data: _kittens3 },
    { id: 'kittensH3', type: 'heading-3', data: 'Sociality' },
    { id: 'kittens4', type: 'text', data: _kittens4 },
    { id: 'catCallout', type: 'callout', data: callout },
    ...goodQuestionBlocks,
    { id: 'fallingCats', type: 'text', data: fallingCats },
    _es(),
    { id: 'catVideoText', type: 'text', data: 'Watch a short documentary about a small cat' },
    { id: 'catVideo', type: 'video', data: video },
    _fuzzyQuiz,
    { id: 'kittensInfo', type: 'text', data: '<b><i>Useful information</i></b>' },
    { id: 'fluffyMp3', type: 'audio', data: mp3 },
    { id: 'catPdf', type: 'file', data: pdf },
    _catsGrid,
    { id: 'catTable', type: 'table', data: catTable },
    { id: 'waveEquation', type: 'block-equation', data: _equation },
    { id: 'catCode', type: 'code', data: catCode },
  ],
}
