import { Box } from '@material-ui/core'
import hospital from '../../../../content/hospital.png'
import hospitalMp3 from '../../../../content/hospital.mp3'
import { UCardField } from './UCardField'

function Template(props: UCardField) {
  return (
    <Box sx={{ maxWidth: '470px', height: '100%' }}>
      <UCardField {...props} />
    </Box>
  )
}

const data1: UCardField = {
  _id: '1',
  name: 'phrase',
  canBeEdited: true,
  isCurrent: true,
  isMediaActive: false,
  type: 'PRE',
  passiveData: 'Some data about a hospital',
}

const data2: UCardField = {
  ...data1,
  passiveData: '',
}

const data3: UCardField = {
  ...data1,
  name: 'image',
  type: 'IMG',
  passiveData: hospital,
}

const data4: UCardField = {
  ...data3,
  passiveData: '',
}

const data5: UCardField = {
  ...data1,
  name: 'audio',
  type: 'AUDIO',
  passiveData: hospitalMp3,
}

const data6: UCardField = {
  ...data5,
  passiveData: '',
}

export const LetsEditText = () => <Template {...data1} />
export const AwaitsTextInput = () => <Template {...data2} />
export const LetsEditImage = () => <Template {...data3} />
export const AwaitsImageInput = () => <Template {...data4} />
export const LetsDeleteImage = () => <Template {...data3} />
export const LetsDeleteAudio = () => <Template {...data5} />
export const LetsUploadAudio = () => <Template {...data6} />
