import _ from 'lodash'
import { avg } from '../../../utils/algorithms'
import { bool, num, str, strs } from '../../../utils/types'
import { SubQuestions } from '../types'

export function getUChecksScore(question: { correctAnswer: strs }, answer: strs): num {
  const difference = _.difference(
    question.correctAnswer.map((a) => a.toLowerCase()),
    answer.map((a) => a.toLowerCase()),
  ).length

  if (!difference) return 1
  if (difference >= question.correctAnswer.length) return 0
  return difference / answer.length
}

export function getUInputScore(question: { correctAnswer: str }, answer: str): num {
  return +(answer.toLowerCase() === question.correctAnswer.toLowerCase())
}

export function getComplexScore(questions: SubQuestions, answers: Map<num, strs>): num {
  const scores = questions.map((q): num => getUChecksScore(q, answers.get(q.i) || []))
  return avg(scores)
}

export function isAnswerCorrect(answer: strs, correctAnswer: strs): bool {
  return getUChecksScore({ correctAnswer }, answer) === 1
}
