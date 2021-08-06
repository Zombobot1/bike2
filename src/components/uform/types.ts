import { strs, Fn, str, bool } from '../../utils/types'
import { Question } from '../study/training/types'

export type Validity = 'VALID' | 'INVALID' | 'NONE'
export interface UFormFieldData {
  _id: str
  answer: strs
  onAnswerChange: (value: string[]) => void
  onAnswer?: Fn
  validationError: str
  wasSubmitted: bool
  question: Question
}
