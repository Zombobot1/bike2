import { Button, Stack, Alert } from '@material-ui/core'
import hospital from '../../../../content/hospital.png'
import hospitalMp3 from '../../../../content/hospital.mp3'
import { UCardField } from './UCardField'
import { useState } from 'react'
import { NewCardData, useNewCardData } from '../../UCardEditor/useNewCardData'
import { Question } from '../../../study/training/types'
import { str } from '../../../../utils/types'

interface TemplateP extends UCardField {
  showSubmit: boolean
}

function Template(props: TemplateP) {
  const [info, setInfo] = useState('')
  const { submit } = useNewCardData(props.name)
  const onSubmit = (data: NewCardData) => setInfo('New value: ' + data.find((d) => d.name === props.name)?.value)

  return (
    <Stack sx={{ maxWidth: '470px', height: '100%' }} spacing={2}>
      {info && <Alert severity="info">{info}</Alert>}
      <UCardField {...props} />
      <Stack direction="row" justifyContent="flex-end">
        {props.showSubmit && <Button onClick={() => submit(onSubmit)}>Submit</Button>}
      </Stack>
    </Stack>
  )
}

const data1: TemplateP = {
  showSubmit: false,
  _id: '1',
  name: 'phrase',
  canBeEdited: true,
  isMediaActive: false,
  type: 'PRE',
  passiveData: 'Some data about a hospital',
}

const data2: TemplateP = {
  ...data1,
  _id: '',
  passiveData: '',
}

const data3: TemplateP = {
  ...data1,
  name: 'image',
  type: 'IMG',
  passiveData: hospital,
}

const data4: TemplateP = {
  ...data3,
  _id: '',
  passiveData: '',
}

const data5: TemplateP = {
  ...data1,
  name: 'audio',
  type: 'AUDIO',
  passiveData: hospitalMp3,
}

const data6: TemplateP = {
  ...data5,
  _id: '',
  passiveData: '',
}

const data7: TemplateP = {
  ...data2,
  _id: '',
  passiveData: '',
  showSubmit: true,
}

const data8: TemplateP = {
  ...data1,
  passiveData: '',
  showSubmit: true,
}

interface UQuestion extends Question {
  _id: str
}

const q = (_id: str, question: str, correctAnswer: str, explanation: str): UQuestion => ({
  _id,
  question,
  correctAnswer: [correctAnswer],
  explanation,
  options: [],
})
const basicQ = q('basicQ', 'Type: a', 'a', 'Just type it using keyboard')

const data9: TemplateP = {
  showSubmit: false,
  _id: '1',
  name: 'question',
  canBeEdited: true,
  isMediaActive: false,
  type: 'INPUT',
  interactiveData: basicQ,
}

export const EditsText = () => <Template {...data1} />
export const AwaitsTextInput = () => <Template {...data2} />
export const EditsImage = () => <Template {...data3} />
export const AwaitsImageInput = () => <Template {...data4} />
export const DeletesImage = () => <Template {...data3} />
export const DeletesAudio = () => <Template {...data5} />
export const UploadsAudio = () => <Template {...data6} />
export const ForbidsSubmissionIfPreviewIsEmpty = () => <Template {...data7} />
export const HandlesNewDataDifferentlyIfHasId = () => <Template {...data8} />
export const EditsUInput = () => <Template {...data9} />
