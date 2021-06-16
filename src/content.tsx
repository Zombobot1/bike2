import { NotificationP } from './components/cards/notification';
import { CardDTO, FieldDTO } from './components/study/training/types';
import hospital from './hospital.png';
import { TrainingDTO } from './components/study/training/training';
import { LastTrainingCardP } from './components/cards/last-training-card';
import { TrainingsGroupDTO } from './components/study/training-deck/training-deck-heading';

const hero_header = 'Learn better with Uni';
const paragraph =
  'Achieve the highest results in studying using the most powerful flashcards application and do not worry about forgetting with flexible spaced repetition';
const btnText = 'Register for free';

const features_header = 'Features';
const features = [
  {
    subheader: 'Spaced repetition',
    description:
      'According to many studies people forget up to 80% of information they learn. \n' +
      '\n' +
      'Different techniques of spaced repetition will help you to consolidate your memories.',
  },
  {
    subheader: 'High flexibility',
    description:
      'Various types of information require different representation to ease learning. \n' +
      '\n' +
      'You can create your own flashcards and integrate images and sounds inside them.',
  },
  {
    subheader: 'Full control',
    description:
      'It is really important to stick to a systematic approach when  learning.\n' +
      '\n' +
      'Uni will organize your study process to help you minimize learning time.',
  },
  {
    subheader: 'Major focus',
    description:
      'Focus more on learning problematical stuff rather than just repeating.\n' +
      '\n' +
      'Uni highlights weaknesses in your memories and lets you deal with them.',
  },
];

const testimonialsHeader = 'Testimonials';
const testimonials = [
  {
    image: 'man',
    review:
      'This application really helps me to deal with huge amount of information which I get at my university. I could not imagine what I would do without it.',
    name: 'Simon Leuner',
  },
  {
    image: 'woman',
    review:
      'Uni helped me to get rid of fear that I forget important information. Now I can track progress of every piece of my knowledge with easily. What a great tool!',
    name: 'Eva Ruber',
  },
  {
    image: 'man-2',
    review: 'Wow! I am really happy to use this application everyday. 12 out of 10.',
    name: 'Egor Veselov',
  },
];
const pricingHeader = 'Pricing';
const prices = [
  {
    header: 'basic',
    features: ['Unlimited flashcards', 'Study organization', 'Error tracking', 'Knowledge review'],
    btnText: 'Register for free',
  },
  {
    header: 'special',
    features: ['Same as Basic', 'Integration with LMS', 'Help with migration'],
    btnText: 'Contact us',
  },
];

export const lastHour = (diff = 1) => {
  const now = new Date();
  now.setHours(now.getHours() - diff);
  return now.toISOString();
};

export const yesterday = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString();
};

export const lastMonth = () => {
  const now = new Date();
  now.setDate(now.getDate() - 31);
  return now.toISOString();
};

const notifications: NotificationP[] = [
  {
    overdue: 'NONE',
    deckColor: '#FF5151',
    deckPath: 'Statistical methods / Lectures',
    deckName: 'Bayesian approach',
    repeatingCardsNumber: 234,
    receivingTime: lastHour(2),
  },
  {
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckPath: 'Statistical methods / Lectures',
    deckName: 'Bayesian approach',
    repeatingCardsNumber: 234,
    receivingTime: lastHour(2),
  },
  {
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckPath: 'Statistical methods / Lectures',
    deckName: 'Bayesian approach',
    repeatingCardsNumber: 234,
    receivingTime: lastHour(2),
  },
  {
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckPath: 'Statistical methods / Lectures',
    deckName: 'Bayesian approach',
    repeatingCardsNumber: 234,
    receivingTime: lastHour(2),
  },
  {
    overdue: 'NONE',
    deckColor: '#FC5C9F',
    deckPath: 'C++ programming language',
    deckName: 'Chapter 1',
    repeatingCardsNumber: 1200,
    receivingTime: yesterday(),
  },
];

const lastTrainings: LastTrainingCardP[] = [
  {
    overdue: 'NONE',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    editingDate: new Date().toISOString(),
    trainingCardsInfo: { toRepeat: 123, toLearn: 234 },
  },
  {
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    editingDate: lastHour(),
    trainingCardsInfo: { toRepeat: 123, toLearn: 0 },
  },
  {
    overdue: 'WARNING',
    deckColor: '#FCA95C',
    deckName: 'Workers',
    editingDate: yesterday(),
    trainingCardsInfo: { toRepeat: 0, toLearn: 234 },
  },
  {
    overdue: 'DANGER',
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    editingDate: lastMonth(),
    trainingCardsInfo: { toRepeat: 1930, toLearn: 234 },
  },
];

const overview = {
  lastTrainings,
  deckProgresses: [
    {
      deckColor: '#FF5151',
      deckName: 'Math',
      progress: 0.934,
    },
    {
      deckColor: '#FCA95C',
      deckName: 'Js',
      progress: 0.6234,
    },
    {
      deckColor: '#735CFC',
      deckName: 'English',
      progress: 0.74,
    },
    {
      deckColor: '#FC5C9F',
      deckName: 'C++',
      progress: 0.834,
    },
    {
      deckColor: '#2730FD',
      deckName: 'Python',
      progress: 0.52,
    },
    {
      deckColor: '#DC5CFC',
      deckName: 'Cooking',
      progress: 0.77234,
    },
  ],
  lastEditedCards: [
    {
      deckColor: '#2730FD',
      deckName: 'Pathlib',
      editingDate: new Date().toISOString(),
    },
    {
      deckColor: '#FC5C9F',
      deckName: 'Chapter 1',
      editingDate: lastHour(),
    },
    {
      deckColor: '#DC5CFC',
      deckName: 'Borsh',
      editingDate: lastHour(),
    },
    {
      deckColor: '#eced2b',
      deckName: 'Async & Await',
      editingDate: yesterday(),
    },
  ],
  lastReviews: [
    {
      deckName: 'C++ programming language',
      deckColor: '#FC5C9F',
      reviewDate: lastMonth(),
      reviewResult: 0.954,
    },
    {
      deckName: 'Bayesian approach',
      deckColor: '#FF5151',
      reviewDate: lastMonth(),
      reviewResult: 0.824,
    },
  ],
  cardsPerDayData: [
    {
      id: 'cards per day',
      data: [
        { x: '31/01', y: 49 },
        { x: '01/02', y: 235 },
        { x: '02/02', y: 238 },
        { x: '03/02', y: 171 },
        { x: '04/02', y: 207 },
        { x: '05/02', y: 30 },
        { x: '06/02', y: 94 },
        { x: '07/02', y: 128 },
        { x: '08/02', y: 174 },
        { x: '09/02', y: 151 },
        { x: '10/02', y: 238 },
        { x: '11/02', y: 70 },
      ],
    },
  ],
  cardsTypesData: [
    { id: 'new', value: 234 },
    { id: 'learning', value: 324 },
    { id: 'expect review', value: 873 },
    { id: 'repeating', value: 100 },
  ],
  timeInAppData: [
    {
      id: 'time in app',
      data: [
        { x: '31/01', y: 123 },
        { x: '01/02', y: 190 },
        { x: '02/02', y: 28 },
        { x: '03/02', y: 94 },
        { x: '04/02', y: 128 },
        { x: '05/02', y: 274 },
        { x: '06/02', y: 151 },
        { x: '07/02', y: 72 },
        { x: '08/02', y: 174 },
        { x: '09/02', y: 101 },
        { x: '10/02', y: 238 },
        { x: '11/02', y: 270 },
        { x: '12/02', y: 49 },
        { x: '13/02', y: 235 },
        { x: '14/02', y: 238 },
        { x: '15/02', y: 171 },
        { x: '16/02', y: 207 },
        { x: '17/02', y: 161 },
        { x: '18/02', y: 287 },
        { x: '19/02', y: 301 },
        { x: '20/02', y: 294 },
        { x: '21/02', y: 30 },
        { x: '22/02', y: 238 },
        { x: '23/02', y: 70 },
      ],
    },
  ],
};

const question = `The English language is conventionally divided into three historical periods. In which of these periods did William Shakespeare write his plays?


(a) Old English
(b) Middle English
(c) Modern English
`;

const answer = `(c) The period of Modern English extends from the 1500s to the present day. Shakespeare wrote his plays between 1590 and 1613.`;

const field1: FieldDTO = {
  type: 'PRE',
  passiveData: question,
  side: 'FRONT',
};

const field2: FieldDTO = {
  type: 'PRE',
  passiveData: answer,
  side: 'BACK',
};

const field3: FieldDTO = {
  type: 'PRE',
  passiveData: 'Hospital',
  side: 'FRONT',
};

const field4: FieldDTO = {
  type: 'PRE',
  passiveData: 'ˈhɒspɪtl',
  side: 'FRONT',
};

const field6: FieldDTO = {
  type: 'IMG',
  passiveData: hospital,
  side: 'FRONT',
};

const field7: FieldDTO = {
  type: 'AUDIO',
  passiveData: 'https://dictionary.cambridge.org/media/english/uk_pron/u/ukh/ukhor/ukhorsi013.mp3',
  side: 'BACK',
};

const field5: FieldDTO = {
  type: 'PRE',
  passiveData: 'das Krankenhaus',
  side: 'BACK',
};

const field8: FieldDTO = {
  type: 'RADIO',
  interactiveData: {
    question: 'Please select one:',
    options: ['Option 1', 'Option 2'],
    correctAnswer: 'Option 2',
    explanation: 'Cuz',
  },
  side: 'FRONT',
};

const field9: FieldDTO = {
  type: 'RADIO',
  interactiveData: {
    question: 'Please select another one:',
    options: ['Right', 'Wrong'],
    correctAnswer: 'Right',
    explanation: 'Cuz',
  },
  side: 'FRONT',
};

const field10: FieldDTO = {
  type: 'PRE',
  passiveData: 'Listen and write the missing word:',
  side: 'FRONT',
};

const field11: FieldDTO = {
  type: 'AUDIO',
  passiveData: 'https://dictionary.cambridge.org/media/english/uk_pron/u/ukh/ukhor/ukhorsi013.mp3',
  side: 'FRONT',
};

const field12: FieldDTO = {
  type: 'PRE',
  passiveData: 'I need to go to the ... to have an operation.',
  side: 'FRONT',
};

const field13: FieldDTO = {
  type: 'INPUT',
  interactiveData: {
    question: '',
    options: [],
    correctAnswer: 'hospital',
    explanation: 'hospital',
  },
  side: 'FRONT',
};

export const uCard: CardDTO = {
  _id: '1',
  fields: [field6, field3, field4, field5, field7],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'PASSIVE',
};

export const iCard1: CardDTO = {
  _id: '10',
  fields: [field8],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
};

export const iCardUInput: CardDTO = {
  _id: '12',
  fields: [field10, field11, field12, field13],
  timeToAnswer: 3000,
  stageColor: 'red',
  type: 'INTERACTIVE',
};

export const iCard2: CardDTO = {
  _id: '11',
  fields: [field9],
  timeToAnswer: 3000,
  stageColor: 'green',
  type: 'INTERACTIVE',
};

export const card2: CardDTO = {
  _id: '2',
  fields: [field1, field2],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
};

export const card3: CardDTO = {
  _id: '3',
  fields: [field3, field2],
  timeToAnswer: 3000,
  stageColor: 'blue',
  type: 'PASSIVE',
};

export const uTraining: TrainingDTO = {
  _id: '1',
  overdue: 'NONE',
  deckColor: '#FF5151',
  deckName: 'Bayesian approach',
  deckPath: 'Statistical methods / Lectures',
  trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  cards: [iCard1, iCardUInput, card2, uCard],
};

export const iTraining: TrainingDTO = {
  _id: '1',
  overdue: 'NONE',
  deckColor: '#FF5151',
  deckName: 'Bayesian approach',
  deckPath: 'Statistical methods / Lectures',
  trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  cards: [iCard1, iCard2],
};

const mathTrainings: TrainingDTO[] = [
  uTraining,
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
];
const jsTrainings: TrainingDTO[] = [
  {
    _id: '1',
    overdue: 'DANGER',
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#FCA95C',
    deckName: 'Workers',
    deckPath: 'Browsers',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#eced2b',
    deckName: 'Async & Await',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
];
const englishTrainings: TrainingDTO[] = [
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
];
const cppTrainings: TrainingDTO[] = [
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
];
const pythonTrainings: TrainingDTO[] = [
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'NONE',
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
];
const cookingTrainings: TrainingDTO[] = [
  {
    _id: '1',
    overdue: 'DANGER',
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
  },
  {
    _id: '1',
    overdue: 'WARNING',
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
    cards: [uCard, card2],
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

const trainingDecksSettings = {
  trainingDecks: {
    Js: {
      subdecksNames: ['Basics', 'Advanced'],
      parentsNames: ['IT', 'Programming languages'],
    },
    Python: {
      subdecksNames: ['Libraries', 'Advanced'],
      parentsNames: ['IT', 'Programming languages'],
    },
  },
  split: (root: string, subdeck: string) => {
    console.info('split', root, subdeck);
  },
  merge: (root: string, subdeck: string) => {
    console.info('merge', root, subdeck);
  },
};

const study = {
  trainingDecks,
  trainingDecksSettings,
};

const appData = {
  hero: {
    header: hero_header,
    paragraph,
    btnText,
  },
  features: {
    header: features_header,
    features,
  },
  pricing: {
    testimonialsHeader,
    testimonials,
    pricingHeader,
    prices,
  },
  notifications,
  overview,
  study,
};

export default appData;
