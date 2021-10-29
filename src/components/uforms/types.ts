import { strs, Fn, str, bool } from '../../utils/types'
import { Question } from '../studying/training/types'

export type Validity = 'valid' | 'invalid' | 'none'
export interface UFormFieldData {
  answer: strs
  onAnswerChange: (value: strs) => void
  onAnswer?: Fn
  validationError: str
  wasSubmitted: bool
  question: Question
}
