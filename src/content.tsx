import { OverdueType } from './components/cards/notification/notification';
import { TrainingType } from './components/study/training/types';

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

const notification = {
  overdue: OverdueType.Warning,
  deckColor: '#FF5151',
  deckPath: 'Statistical methods / Lectures',
  deckName: 'Bayesian approach',
  repeatingCardsNumber: 234,
  receivingTime: lastHour(2),
};
const notification2 = {
  overdue: OverdueType.None,
  deckColor: '#FC5C9F',
  deckPath: 'C++ programming language',
  deckName: 'Chapter 1',
  repeatingCardsNumber: 1200,
  receivingTime: yesterday(),
};
const notifications = [notification, notification2, notification, notification2, notification];

const overview = {
  lastTrainings: [
    {
      overdue: OverdueType.None,
      deckColor: '#FF5151',
      deckName: 'Bayesian approach',
      editingDate: new Date().toISOString(),
      trainingCardsInfo: { toRepeat: 123, toLearn: 234 },
    },
    {
      overdue: OverdueType.None,
      deckColor: '#735CFC',
      deckName: 'Exersices 1-10',
      editingDate: lastHour(),
      trainingCardsInfo: { toRepeat: 123, toLearn: 0 },
    },
    {
      overdue: OverdueType.Warning,
      deckColor: '#FCA95C',
      deckName: 'Workers',
      editingDate: yesterday(),
      trainingCardsInfo: { toRepeat: 0, toLearn: 234 },
    },
    {
      overdue: OverdueType.Danger,
      deckColor: '#FC5C9F',
      deckName: 'Chapter 1',
      editingDate: lastMonth(),
      trainingCardsInfo: { toRepeat: 1930, toLearn: 234 },
    },
  ],
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

const mathTrainings = [
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const jsTrainings = [
  {
    id: '1',
    overdue: OverdueType.Danger,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#FCA95C',
    deckName: 'Functions',
    deckPath: 'Basics',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#FCA95C',
    deckName: 'Workers',
    deckPath: 'Browsers',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#eced2b',
    deckName: 'Async & Await',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#eced2b',
    deckName: 'Proxy',
    deckPath: 'Advanced',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const englishTrainings = [
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cppTrainings = [
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const pythonTrainings = [
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.None,
    deckColor: '#2730FD',
    deckName: 'Pathlib',
    deckPath: 'Libraries',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];
const cookingTrainings = [
  {
    id: '1',
    overdue: OverdueType.Danger,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
  {
    id: '1',
    overdue: OverdueType.Warning,
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recepies',
    trainingCardsInfo: { toRepeat: 234, toLearn: 234 },
  },
];

const trainingDecks = [
  { deckName: 'Math', trainings: mathTrainings },
  { deckName: 'Js', trainings: jsTrainings },
  { deckName: 'English', trainings: englishTrainings },
  { deckName: 'C++', trainings: cppTrainings },
  { deckName: 'Python', trainings: pythonTrainings },
  { deckName: 'Cooking', trainings: cookingTrainings },
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

const question = `The English language is conventionally divided into three historical periods. In which of these periods did William Shakespeare write his plays?


(a) Old English
(b) Middle English
(c) Modern English
`;

const answer = `(c) The period of Modern English extends from the 1500s to the present day. Shakespeare wrote his plays between 1590 and 1613.`;

export const training = {
  id: '1',
  deckName: 'Exercises 1-10',
  type: TrainingType.Learning,
  cards: [
    {
      id: '1',
      question,
      answer,
      timeout: 3000,
      stageColor: 'red',
    },
    {
      id: '2',
      question,
      answer,
      timeout: 2,
      stageColor: 'blue',
    },
  ],
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
  training,
};

export default appData;
