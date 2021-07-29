import { useState } from 'react'
import { bool, Fn, str, strs } from '../../utils/types'
import { uuid } from '../../utils/utils'
import { Question } from '../study/training/types'
import { UChecks } from './ufields/uchecks'
import { UInput } from './ufields/uinput'
import { useUFormField } from './useUForm'

type FieldType = 'RADIO' | 'INPUT' | 'CHECKS' | 'TEXT'

export interface UFormField {
  _id?: str
  question?: Question
  onAnswer?: Fn
  initialAnswer?: strs
  shuffleOptions?: bool
  autoFocus?: bool
  showTipOnMobile?: bool
}

export function UFormField({
  _id,
  question,
  onAnswer,
  initialAnswer,
  shuffleOptions,
  autoFocus,
  showTipOnMobile,
}: UFormField) {
  const [type] = useState<FieldType>(() => deduceType(question))
  const [id] = useState<str>(() => (_id ? _id : uuid()))
  const props = useUFormField(id, question, initialAnswer)

  const commonProps = { _id: id, ...props }
  const checksProps = { ...commonProps, shuffleOptions, onAnswer }
  const inputProps = { ...commonProps, autoFocus, showTipOnMobile, onAnswer }

  if (props.question) {
    return (
      <>
        {type === 'CHECKS' && <UChecks {...checksProps} selectMultiple={true} />}
        {type === 'RADIO' && <UChecks {...checksProps} selectMultiple={false} />}
        {type === 'INPUT' && <UInput {...inputProps} multiline={false} />}
        {type === 'TEXT' && <UInput {...inputProps} multiline={true} />}
      </>
    )
  }
}

function deduceType(question?: Question): FieldType {
  if (!question) return 'INPUT'

  if (!question.options.length) return 'INPUT'
  if (question.correctAnswer.length === 1) return 'RADIO'
  if (question.correctAnswer.length > 1) return 'CHECKS'

  return 'TEXT'
}
