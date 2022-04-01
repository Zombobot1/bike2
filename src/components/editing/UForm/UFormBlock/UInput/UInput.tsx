import { bool } from '../../../../../utils/types'
import { InteractiveQuestion } from '../interactive-question'
import { Feedback } from '../Feedback'
import { UInputField } from './UInputField'
import { Stack } from '@mui/material'
import { EditableText } from '../../../../utils/EditableText/EditableText'
import { TextInput } from '../../../../utils/MuiUtils'
import { UInputData } from '../../../UPage/ublockTypes'
import { UBlockContent } from '../../../types'
import { isAnswerCorrect } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'

export interface UInput extends UBlockContent {
  hideTipOnMobile?: bool
  autoFocus?: bool
}

export function UInput(ps: UInput) {
  if ((ps.data as UInputData).$editing) return <UInputEditor {...ps} />
  return <UInput_ {...ps} />
}

const UInput_ = ({ id, data: d, setData, hideTipOnMobile, autoFocus, type }: UInput) => {
  const data = d as UInputData
  const multiline = type === 'long-answer'

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InteractiveQuestion question={data.question} needsBigMargin={true} />
      <UInputField
        answer={data.$answer}
        correctAnswer={data.correctAnswer}
        autoFocus={autoFocus}
        multiline={multiline}
        setAnswer={(a) => setData(id, { $answer: a })}
        hideTipOnMobile={hideTipOnMobile}
        error={data.$error}
        submitted={data.$submitted}
        onChange={(e) => data.$error && e.length && setData(id, { $error: '' })}
      />
      <Feedback
        isCorrect={multiline || isAnswerCorrect(type, data)}
        explanation={data.explanation || data.correctAnswer}
        error={data.$error}
        submitted={data.$submitted}
      />
    </form>
  )
}

function UInputEditor({ id, data: d, setData, type }: UInput) {
  const data = d as UInputData
  const multiline = type === 'long-answer'

  return (
    <form>
      <Stack spacing={2}>
        <EditableText placeholder="Type question" text={data.question} setText={(q) => setData(id, { question: q })} />
        {!multiline && (
          <TextInput
            variant="outlined"
            placeholder="Set correct answer"
            defaultValue={data.correctAnswer}
            onChange={(e) => data.$error && e.target.value.length && setData(id, { $error: '' })}
            onBlur={(e) => setData(id, { correctAnswer: e.target.value })}
            inputProps={{ 'aria-label': 'correct answer', 'data-cy': 'correct answer' }}
            error={!!data.$error}
            helperText={data.$error}
            autoComplete="off" // keep in form
          />
        )}
        <TextInput
          color="success"
          variant="filled"
          label="Add explanation"
          defaultValue={data.explanation}
          onBlur={(e) => setData(id, { explanation: e.target.value })}
          multiline
          rows={multiline ? 2 : 1}
          inputProps={{ 'aria-label': 'explanation', 'data-cy': 'explanation' }}
          autoComplete="off"
        />
      </Stack>
    </form>
  )
}
