import { CardDTO, FieldDTO } from '../components/study/training/types'
import fluffyJpg from './fluffy.jpg'
import fluffyMp3 from './fluffy.mp3'
import { TrainingDTO } from '../components/study/training/training/training'
import { TrainingsGroupDTO } from '../components/study/training/training/training'

const question = `When do we use the definite article?`

const answer = `The is used to refer to specific or particular nouns.

For example, if I say, "Let's read the book," I mean a specific book. If I say, "Let's read a book," I mean any book rather than a specific book.

Here's another way to explain it: The is used to refer to a specific or particular member of a group. For example, "I just saw the most popular movie of the year." There are many movies, but only one particular movie is the most popular. Therefore, we use the.`

const field1: FieldDTO = {
  _id: 'field1',
  type: 'TEXT',
  data: question,
}

const field2: FieldDTO = {
  _id: 'field2',
  type: 'TEXT',
  data: answer,
}

const fluffyEn: FieldDTO = {
  _id: 'fluffyEn',
  type: 'TEXT',
  data: 'Kitten',
}

const fluffyIpa: FieldDTO = {
  _id: 'fluffyIpa',
  type: 'TEXT',
  data: 'ˈkɪtn',
}

const theatreEn: FieldDTO = {
  _id: 'theatreEn',
  type: 'TEXT',
  data: 'Theatre',
}

const theatreIpa: FieldDTO = {
  _id: 'theatreIpa',
  type: 'TEXT',
  data: 'ˈθiətər',
}

const theatreRu: FieldDTO = {
  _id: 'theatreRu',
  type: 'TEXT',
  data: 'Театр',
}

const fluffyRu: FieldDTO = {
  _id: 'fluffyRu',
  type: 'TEXT',
  data: 'Котёнок',
}

export const fluffyEnLong: FieldDTO = {
  _id: 'fluffyEnLong',
  type: 'TEXT',
  data: 'Looks like you got yourself a little, sleek, gray kitten',
}

const fluffyIpaLong: FieldDTO = {
  _id: 'fluffyIpaLong',
  type: 'TEXT',
  data: 'lʊks laɪk juː gɒt jɔːˈsɛlf ə ˈlɪtl, sliːk, greɪ ˈkɪtn',
}

const fluffyImg: FieldDTO = {
  _id: 'fluffyImg',
  type: 'IMAGE',
  data: fluffyJpg,
}

const fluffyAudio: FieldDTO = {
  _id: 'fluffyAudio',
  type: 'AUDIO',
  data: fluffyMp3,
}

const fluffyRuLong: FieldDTO = {
  _id: 'fluffyRuLong',
  type: 'TEXT',
  data: 'Выглядит ты завела себе веселого, серого котенка.',
}

const selectRight: FieldDTO = {
  _id: 'selectRight',
  type: 'RADIO',
  data: JSON.stringify({
    question: 'Please select one:',
    options: ['Correct', 'Wrong'],
    correctAnswer: ['Correct'],
    explanation: 'Cuz',
  }),
}

const passiveText: FieldDTO = {
  _id: 'passiveText',
  type: 'TEXT',
  data: 'I need to go to the ... to have an operation.',
}

const anotherPassiveText: FieldDTO = {
  _id: 'anotherPassiveText',
  type: 'TEXT',
  data: 'Some short text',
}

const typeA: FieldDTO = {
  _id: 'typeA',
  type: 'INPUT',
  data: JSON.stringify({
    question: 'Please type a and use enter to submit:',
    options: [],
    correctAnswer: ['a'],
    explanation: 'a',
  }),
}

const field15: FieldDTO = {
  _id: 'field15',
  type: 'INPUT',
  data: JSON.stringify({
    question: 'Please type a and DO NOT use enter to submit:',
    options: [],
    correctAnswer: ['b'],
    explanation: 'b',
  }),
}

export const uCardLong: CardDTO = {
  _id: '5',
  fields: [fluffyEnLong],
  hiddenFields: [fluffyImg, fluffyIpaLong, fluffyRuLong, fluffyAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const uCardMinimal: CardDTO = {
  _id: '4',
  fields: [fluffyEn],
  hiddenFields: [fluffyIpa, fluffyRu],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const uCardMinimalF1: CardDTO = {
  _id: 'fast1',
  fields: [fluffyEn],
  hiddenFields: [fluffyIpa, fluffyRu],
  timeToAnswer: 5,
  stageColor: 'white',
}

export const uCardMinimalF2: CardDTO = {
  _id: 'fast2',
  fields: [fluffyEn],
  hiddenFields: [fluffyIpa, fluffyRu],
  timeToAnswer: 5,
  stageColor: 'white',
}

export const cardForUpdate: CardDTO = {
  _id: 'update',
  fields: [theatreEn],
  hiddenFields: [theatreIpa, theatreRu],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const uCardLongWithUpdate: CardDTO = {
  _id: 'get-update',
  fields: [fluffyEnLong],
  hiddenFields: [fluffyImg, fluffyIpaLong, fluffyRuLong, fluffyAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const iCard1: CardDTO = {
  _id: '10',
  fields: [selectRight],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const iCardUInputWithEnter: CardDTO = {
  _id: 'iCardUInputWithEnter',
  fields: [typeA],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const iCardUInputWithoutEnter: CardDTO = {
  _id: 'iCardUInputWithoutEnter',
  fields: [field15],
  timeToAnswer: 3000,
  stageColor: 'red',
}

export const cardWithDifferentFields: CardDTO = {
  _id: 'cardWithDifferentFields',
  fields: [passiveText, selectRight, typeA, anotherPassiveText],
  timeToAnswer: 3000,
  stageColor: 'blue',
}

export const cardWithQandA: CardDTO = {
  _id: '2',
  fields: [field1, field2],
  timeToAnswer: 3000,
  stageColor: 'blue',
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
  cards: [cardForUpdate, uCardMinimal],
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

const mathTrainings: TrainingDTO[] = [trainings.small, trainings.combined]

export const trainingDecks: TrainingsGroupDTO[] = [{ rootDeckName: 'Math', trainings: mathTrainings }]
