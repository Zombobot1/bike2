import { CardDTO, FieldDTO } from '../components/study/training/types'
import hospital from './hospital.png'
import hospitalMp3 from './hospital.mp3'
import { TrainingDTO } from '../components/study/training/training/training'
import { TrainingsGroupDTO } from '../components/study/training/training/training'

const question = `When do we use the definite article?`

const answer = `The is used to refer to specific or particular nouns.

For example, if I say, "Let's read the book," I mean a specific book. If I say, "Let's read a book," I mean any book rather than a specific book.

Here's another way to explain it: The is used to refer to a specific or particular member of a group. For example, "I just saw the most popular movie of the year." There are many movies, but only one particular movie is the most popular. Therefore, we use the.`

const field1: FieldDTO = {
  _id: 'field1',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: question,
  status: 'SHOW',
}

const field2: FieldDTO = {
  _id: 'field2',
  isPreview: false,
  name: 'PRE field',
  type: 'PRE',
  passiveData: answer,
  status: 'HIDE',
}

const hospitalEn: FieldDTO = {
  _id: 'hospitalEn',
  isPreview: false,
  name: 'PRE field',
  type: 'PRE',
  passiveData: 'Hospital',
  status: 'SHOW',
}

const hospitalIpa: FieldDTO = {
  _id: 'hospitalIpa',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'ˈhɒspɪtl',
  status: 'HIDE',
}

const theatreEn: FieldDTO = {
  _id: 'theatreEn',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'Theatre',
  status: 'SHOW',
}

const theatreIpa: FieldDTO = {
  _id: 'theatreIpa',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'ˈθiətər',
  status: 'HIDE',
}

const theatreRu: FieldDTO = {
  _id: 'theatreRu',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'Театр',
  status: 'HIDE',
}

const hospitalRu: FieldDTO = {
  _id: 'hospitalRu',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'Госпиталь',
  status: 'HIDE',
}

export const hospitalEnLong: FieldDTO = {
  _id: 'hospitalEnLong',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'Hospital Hospital Hospital Hospital',
  status: 'SHOW',
}

const hospitalIpaLong: FieldDTO = {
  _id: 'hospitalIpaLong',
  type: 'PRE',
  isPreview: false,
  name: 'PRE field',
  passiveData: 'ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl',
  status: 'HIDE',
}

const hospitalImg: FieldDTO = {
  _id: 'hospitalImg',
  name: 'IMG field',
  isPreview: false,
  type: 'IMG',
  passiveData: hospital,
  status: 'HIDE',
}

const hospitalAudio: FieldDTO = {
  _id: 'hospitalAudio',
  name: 'AUDIO field',
  isPreview: false,
  type: 'AUDIO',
  passiveData: hospitalMp3,
  status: 'HIDE',
}

const hospitalRuLong: FieldDTO = {
  _id: 'hospitalRuLong',
  name: 'PRE field',
  isPreview: false,
  type: 'PRE',
  passiveData: 'Госпиталь Госпиталь Госпиталь',
  status: 'HIDE',
}

const selectRight: FieldDTO = {
  _id: 'selectRight',
  isPreview: false,
  name: 'RADIO field',
  type: 'RADIO',
  interactiveData: {
    question: 'Please select one:',
    options: ['Correct', 'Wrong'],
    correctAnswer: ['Correct'],
    explanation: 'Cuz',
  },
  status: 'SHOW',
}

const passiveText: FieldDTO = {
  _id: 'passiveText',
  isPreview: false,
  name: 'PRE field',
  type: 'PRE',
  passiveData: 'I need to go to the ... to have an operation.',
  status: 'SHOW',
}

const anotherPassiveText: FieldDTO = {
  _id: 'anotherPassiveText',
  isPreview: false,
  name: 'PRE field',
  type: 'PRE',
  passiveData: 'Some short text',
  status: 'SHOW',
}

const typeA: FieldDTO = {
  _id: 'typeA',
  isPreview: false,
  name: 'INPUT field',
  type: 'INPUT',
  interactiveData: {
    question: 'Please type a and use enter to submit:',
    options: [],
    correctAnswer: ['a'],
    explanation: 'a',
  },
  status: 'SHOW',
}

const field15: FieldDTO = {
  _id: 'field15',
  isPreview: false,
  name: 'INPUT field',
  type: 'INPUT',
  interactiveData: {
    question: 'Please type a and DO NOT use enter to submit:',
    options: [],
    correctAnswer: ['b'],
    explanation: 'b',
  },
  status: 'SHOW',
}

export const uCardLong: CardDTO = {
  _id: '5',
  fields: [hospitalImg, hospitalEnLong, hospitalRuLong, hospitalIpaLong, hospitalAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
}

export const uCardLongWithUpdate: CardDTO = {
  _id: 'get update',
  fields: [hospitalImg, hospitalEnLong, hospitalRuLong, hospitalIpaLong, hospitalAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
}

export const uCardMinimal: CardDTO = {
  _id: '4',
  fields: [hospitalEn, hospitalIpa, hospitalRu],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
}

export const uCardMinimalF1: CardDTO = {
  _id: 'fast1',
  fields: [hospitalEn, hospitalIpa, hospitalRu],
  timeToAnswer: 5,
  stageColor: 'white',
  type: 'PASSIVE',
}

export const uCardMinimalF2: CardDTO = {
  _id: 'fast2',
  fields: [hospitalRu, hospitalIpa, hospitalEn],
  timeToAnswer: 5,
  stageColor: 'white',
  type: 'PASSIVE',
}

export const cardForUpdate: CardDTO = {
  _id: 'update',
  fields: [theatreEn, theatreIpa, theatreRu],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
}

export const iCard1: CardDTO = {
  _id: '10',
  fields: [selectRight],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
}

export const iCardUInputWithEnter: CardDTO = {
  _id: 'iCardUInputWithEnter',
  fields: [typeA],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
}

export const iCardUInputWithoutEnter: CardDTO = {
  _id: 'iCardUInputWithoutEnter',
  fields: [field15],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
}

export const cardWithDifferentFields: CardDTO = {
  _id: 'cardWithDifferentFields',
  fields: [passiveText, selectRight, typeA, anotherPassiveText],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
}

export const cardWithQandA: CardDTO = {
  _id: '2',
  fields: [field1, field2],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
}

const basic: TrainingDTO = {
  _id: 'simple',
  deckColor: '#FF5151',
  deckName: 'Bayesian approach',
  deckPath: 'Statistical methods ',
  trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
  cards: [uCardLong, uCardMinimal],
}

const simple: TrainingDTO = {
  ...basic,
  _id: 'simple',
  cards: [uCardLong, uCardMinimal],
}

const statsCheck: TrainingDTO = {
  ...basic,
  _id: 'statsCheck',
  cards: [uCardMinimalF1, uCardMinimalF2],
}

const small: TrainingDTO = {
  ...basic,
  _id: 'small',
  cards: [uCardMinimalF1],
}

const withUpdateFromServer: TrainingDTO = {
  ...basic,
  _id: 'simple',
  cards: [uCardLongWithUpdate, uCardMinimal],
}

const interactive: TrainingDTO = {
  ...basic,
  _id: 'interactive',
  cards: [iCardUInputWithoutEnter, iCard1, iCardUInputWithEnter],
}

const combined: TrainingDTO = {
  ...basic,
  _id: 'combined',
  cards: [uCardLong, uCardMinimal, iCardUInputWithEnter, iCard1],
}

const autofocusCheck: TrainingDTO = {
  ...basic,
  _id: 'autofocusCheck',
  cards: [uCardMinimal, iCardUInputWithEnter, uCardLong],
}

export const trainings = {
  small,
  simple,
  withUpdateFromServer,
  interactive,
  combined,
  autofocusCheck,
  statsCheck,
}

const mathTrainings: TrainingDTO[] = [trainings.small, trainings.simple]

export const trainingDecks: TrainingsGroupDTO[] = [{ rootDeckName: 'Math', trainings: mathTrainings }]
