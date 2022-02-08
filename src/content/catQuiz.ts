import { InlineExerciseData, UBlock, UChecksData, UInputData } from '../components/editing/UPage/types'
import { str } from '../utils/types'

const qc = (qe = '', ca = [''], o = [''], e = ''): UChecksData => {
  return { question: qe, options: o, correctAnswer: ca, explanation: e }
}
const qi = (qe = '', ca = '', e = ''): UInputData => {
  return { question: qe, correctAnswer: ca, explanation: e }
}

const fqQ1: UBlock = {
  id: 'fq-q1',
  type: 'single-choice',
  data: qc(
    'What is the proper term for a group of kittens?',
    ['kindle'],
    ['kaboodle', 'kine', 'kindle', 'kettle'],
    'The proper term for a group of kittens is a kindle, litter or intrigue.',
  ),
}

const fqQ2: UBlock = {
  id: 'fq-q2',
  type: 'multiple-choice',
  data: qc(
    'Why do cats rub against you?',
    ['To say hello', 'To show affiliation'],
    ['To say hello', 'They are itched', 'To show affiliation', 'They are stressed'],
    'It is an affectionate gesture that can also be used as a form of greeting.',
  ),
}

const fqQ3: UBlock = {
  id: 'fq-q3',
  type: 'short-answer',
  data: qi('What breed of domestic cat has the longest fur?', 'Persian'),
}

const inlineExercise: InlineExerciseData = [
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

const fqInlineExercise: UBlock = {
  id: 'fq-inline-exercise',
  type: 'inline-exercise',
  data: inlineExercise,
}

export const _fuzzyQuiz: UBlock = {
  id: 'fuzzy-quiz',
  type: 'exercise',
  data: { name: 'Fuzzy quiz', ublocks: [fqQ1, fqQ2, fqQ3, fqInlineExercise] },
}

export const _fuzzyQuizShort: UBlock = {
  id: 'fq',
  type: 'exercise',
  data: { name: 'Fuzzy quiz', ublocks: [fqQ1, fqQ2, fqQ3] },
}

export const _quizWith1InlineExercise: UBlock = {
  id: 'qw1e',
  type: 'exercise',
  data: { name: 'Test', ublocks: [fqInlineExercise] },
}

export const _quizWith1InputField: UBlock = {
  id: 'qw1i',
  type: 'exercise',
  data: { name: 'Test', ublocks: [fqQ3] },
}
