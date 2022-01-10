import { strs, str, bool, num, SetStr } from '../../utils/types'
import { UBlockType } from '../editing/types'

export type Correctness = 'correct' | 'incorrect' | 'none'

export type OnUFormSubmissionAttempt = (id: str, score: num, error?: str) => void

export interface UFormFieldInfo {
  wasSubmitted: bool
  submissionAttempt: num
  onSubmissionAttempt: OnUFormSubmissionAttempt
  resolveError: SetStr
  submitOnAnswer?: bool
  isEditing?: bool
}

export interface UFormFieldData extends UFormFieldInfo {
  id: str
  data: str
  setData: SetStr
}

export const ANSWER_REQUIRED = 'Answer required!'
export const SELECT_CORRECT = 'Select correct answer!'
export const INVALID_EXERCISE = 'Exercise contains mistakes!'

export class QuestionBase {
  question = ''
  explanation = ''
}

export class UChecksDTO extends QuestionBase {
  correctAnswer: strs = []
  options: strs = []
}

export class UInputDTO extends QuestionBase {
  correctAnswer = ''
}

export interface SubQuestion {
  i: num
  type: UBlockType
  correctAnswer: strs
  options: strs
  explanation: str
}
export type SubQuestions = SubQuestion[]

export type InlineExerciseDTO = Array<str | SubQuestion>
