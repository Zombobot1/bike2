import { CardDTO, FieldDTO } from '../components/study/training/types';
import hospital from './hospital.png';
import hospitalMp3 from './hospital.mp3';
import { TrainingDTO } from '../components/study/training/training';
import { TrainingsGroupDTO } from '../components/study/training/training/training';

const question = `When do we use the definite article?`;

const answer = `The is used to refer to specific or particular nouns.

For example, if I say, "Let's read the book," I mean a specific book. If I say, "Let's read a book," I mean any book rather than a specific book.

Here's another way to explain it: The is used to refer to a specific or particular member of a group. For example, "I just saw the most popular movie of the year." There are many movies, but only one particular movie is the most popular. Therefore, we use the.`;

const field1: FieldDTO = {
  _id: 'field1',
  type: 'PRE',
  passiveData: question,
  status: 'SHOW',
};

const field2: FieldDTO = {
  _id: 'field2',
  type: 'PRE',
  passiveData: answer,
  status: 'HIDE',
};

const hospitalEn: FieldDTO = {
  _id: 'hospitalEn',
  type: 'PRE',
  passiveData: 'Hospital',
  status: 'SHOW',
};

const hospitalIpa: FieldDTO = {
  _id: 'hospitalIpa',
  type: 'PRE',
  passiveData: 'ˈhɒspɪtl',
  status: 'HIDE',
};

const theatreEn: FieldDTO = {
  _id: 'theatreEn',
  type: 'PRE',
  passiveData: 'Theatre',
  status: 'SHOW',
};

const theatreIpa: FieldDTO = {
  _id: 'theatreIpa',
  type: 'PRE',
  passiveData: 'ˈθiətər',
  status: 'HIDE',
};

const theatreRu: FieldDTO = {
  _id: 'theatreRu',
  type: 'PRE',
  passiveData: 'Театр',
  status: 'HIDE',
};

const hospitalRu: FieldDTO = {
  _id: 'hospitalRu',
  type: 'PRE',
  passiveData: 'Госпиталь',
  status: 'HIDE',
};

const hospitalEnLong: FieldDTO = {
  _id: 'hospitalEnLong',
  type: 'PRE',
  passiveData: 'Hospital Hospital Hospital Hospital',
  status: 'SHOW',
};

const hospitalIpaLong: FieldDTO = {
  _id: 'hospitalIpaLong',
  type: 'PRE',
  passiveData: 'ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl ˈhɒspɪtl',
  status: 'HIDE',
};

const hospitalImg: FieldDTO = {
  _id: 'hospitalImg',
  type: 'IMG',
  passiveData: hospital,
  status: 'HIDE',
};

const hospitalAudio: FieldDTO = {
  _id: 'hospitalAudio',
  type: 'AUDIO',
  passiveData: hospitalMp3,
  status: 'HIDE',
};

const hospitalRuLong: FieldDTO = {
  _id: 'hospitalRuLong',
  type: 'PRE',
  passiveData: 'Госпиталь Госпиталь Госпиталь',
  status: 'HIDE',
};

const selectRight: FieldDTO = {
  _id: 'selectRight',
  type: 'RADIO',
  interactiveData: {
    question: 'Please select one:',
    options: ['Correct', 'Wrong'],
    correctAnswer: ['Correct'],
    explanation: 'Cuz',
  },
  status: 'SHOW',
};

const passiveText: FieldDTO = {
  _id: 'passiveText',
  type: 'PRE',
  passiveData: 'I need to go to the ... to have an operation.',
  status: 'SHOW',
};

const anotherPassiveText: FieldDTO = {
  _id: 'anotherPassiveText',
  type: 'PRE',
  passiveData: 'Some short text',
  status: 'SHOW',
};

const typeA: FieldDTO = {
  _id: 'typeA',
  type: 'INPUT',
  interactiveData: {
    question: 'Please type a and use enter to submit:',
    options: [],
    correctAnswer: ['a'],
    explanation: 'a',
  },
  status: 'SHOW',
};

const field15: FieldDTO = {
  _id: 'field15',
  type: 'INPUT',
  interactiveData: {
    question: 'Please type a and DO NOT use enter to submit:',
    options: [],
    correctAnswer: ['b'],
    explanation: 'b',
  },
  status: 'SHOW',
};

export const uCardLong: CardDTO = {
  _id: '5',
  fields: [hospitalImg, hospitalEnLong, hospitalRuLong, hospitalIpaLong, hospitalAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
};

export const uCardLongWithUpdate: CardDTO = {
  _id: 'get update',
  fields: [hospitalImg, hospitalEnLong, hospitalRuLong, hospitalIpaLong, hospitalAudio],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
};

export const uCardMinimal: CardDTO = {
  _id: '4',
  fields: [hospitalEn, hospitalIpa, hospitalRu],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
};

export const cardForUpdate: CardDTO = {
  _id: 'update',
  fields: [theatreEn, theatreIpa, theatreRu],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
};

export const iCard1: CardDTO = {
  _id: '10',
  fields: [selectRight],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
};

export const iCardUInputWithEnter: CardDTO = {
  _id: 'iCardUInputWithEnter',
  fields: [typeA],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
};

export const iCardUInputWithoutEnter: CardDTO = {
  _id: 'iCardUInputWithoutEnter',
  fields: [field15],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
};

export const cardWithDifferentFields: CardDTO = {
  _id: 'cardWithDifferentFields',
  fields: [passiveText, selectRight, typeA, anotherPassiveText],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
};

export const cardWithQandA: CardDTO = {
  _id: '2',
  fields: [field1, field2],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
};

const basic: TrainingDTO = {
  _id: 'simple',
  deckColor: '#FF5151',
  deckName: 'Bayesian approach',
  deckPath: 'Statistical methods / Lectures',
  trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
  cards: [uCardLong, uCardMinimal],
};

const simple: TrainingDTO = {
  ...basic,
  _id: 'simple',
  cards: [uCardLong, uCardMinimal],
};

const withUpdateFromServer: TrainingDTO = {
  ...basic,
  _id: 'simple',
  cards: [uCardLongWithUpdate, uCardMinimal],
};

const interactive: TrainingDTO = {
  ...basic,
  _id: 'interactive',
  cards: [iCardUInputWithoutEnter, iCard1, iCardUInputWithEnter],
};

const combined: TrainingDTO = {
  ...basic,
  _id: 'combined',
  cards: [uCardLong, uCardMinimal, iCardUInputWithEnter, iCard1],
};

const autofocusCheck: TrainingDTO = {
  ...basic,
  _id: 'autofocusCheck',
  cards: [uCardLong, iCardUInputWithEnter, uCardMinimal],
};

export const trainings = {
  simple,
  withUpdateFromServer,
  interactive,
  combined,
  autofocusCheck,
};

const mathTrainings: TrainingDTO[] = [
  trainings.simple,
  {
    _id: '1',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];
const jsTrainings: TrainingDTO[] = [
  {
    _id: '1',

    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FCA95C',
    deckName: 'Workers',
    deckPath: 'Browsers',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#eced2b',
    deckName: 'Async & Await',
    deckPath: 'Advanced',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];
const englishTrainings: TrainingDTO[] = [
  {
    _id: '1',

    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];
const cppTrainings: TrainingDTO[] = [
  {
    _id: '1',

    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];
const pythonTrainings: TrainingDTO[] = [
  {
    _id: '1',

    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];
const cookingTrainings: TrainingDTO[] = [
  {
    _id: '1',

    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
  {
    _id: '1',

    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingConceptsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCardLong, cardWithQandA],
  },
];

export const trainingDecks: TrainingsGroupDTO[] = [
  { rootDeckName: 'Math', trainings: mathTrainings },
  { rootDeckName: 'Js', trainings: jsTrainings },
  { rootDeckName: 'English', trainings: englishTrainings },
  { rootDeckName: 'C++', trainings: cppTrainings },
  { rootDeckName: 'Python', trainings: pythonTrainings },
  { rootDeckName: 'Cooking', trainings: cookingTrainings },
];
