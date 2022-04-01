import { strs } from '../../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { Box } from '@mui/material'
import { Feedback } from '../Feedback'
import { UChecksOptions } from './UChecksOptions'
import { UChecksEditor } from './UChecksEditor'
import { UChecksData } from '../../../UPage/ublockTypes'
import { UBlockContent } from '../../../types'
import { isAnswerCorrect } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'

export type UChecks = UBlockContent

export function UChecks(ps: UChecks) {
  if ((ps.data as UChecksData).$editing) return <UChecksEditor {...ps} />
  return <UChecks_ {...ps} />
}

const UChecks_ = ({ id, type, data: d, setData }: UChecks) => {
  const data = d as UChecksData
  const selectMultiple = type === 'multiple-choice'
  const setAnswer = (_answer: strs) => {
    if (data.$error && _answer.length) setData(id, { $error: '', $answer: _answer })
    else setData(id, { $answer: _answer })
  }
  return (
    <Box>
      <InteractiveQuestion question={data.question} />
      <UChecksOptions
        answer={data.$answer}
        correctAnswer={data.correctAnswer}
        setAnswer={setAnswer}
        options={data.options}
        selectMultiple={selectMultiple}
        error={data.$error}
        submitted={data.$submitted}
      />
      <Feedback
        isCorrect={isAnswerCorrect(type, data)}
        explanation={data.explanation}
        error={data.$error}
        submitted={data.$submitted}
      />
    </Box>
  )
}
