import { Button, Stack, Alert } from '@material-ui/core'
import hospital from '../../../../content/hospital.png'
import hospitalMp3 from '../../../../content/hospital.mp3'
import { UCardField } from './UCardField'
import { useState } from 'react'
import { NewCardData, useNewCardData } from '../../UCardEditor/useNewCardData'

interface TemplateP extends UCardField {
  showSubmit: boolean
}

function Template(props: TemplateP) {
  const [info, setInfo] = useState('')
  const { submit } = useNewCardData(props.name)
  const onSubmit = (data: NewCardData) => setInfo('New value: ' + data.find((d) => d.name === props.name)?.toString())

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
  isCurrent: true,
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

export const LetsEditText = () => <Template {...data1} />
export const AwaitsTextInput = () => <Template {...data2} />
export const LetsEditImage = () => <Template {...data3} />
export const AwaitsImageInput = () => <Template {...data4} />
export const LetsDeleteImage = () => <Template {...data3} />
export const LetsDeleteAudio = () => <Template {...data5} />
export const LetsUploadAudio = () => <Template {...data6} />
export const ForbidsSubmissionIfPreviewIsEmpty = () => <Template {...data7} />
