import { useReactiveObject } from '../../../utils/hooks/hooks'
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded'
import { UBlockComponentB } from '../../types'
import { useUFile } from '../useUFile'
import { UAudio } from '../../../utils/UAudio/UAudio'
import { ucast } from '../../../../utils/utils'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'

export class UAudioFileDTO {
  src = ''
}

export function UAudioFile({ data, setData, readonly }: UBlockComponentB) {
  const [fileData] = useReactiveObject(ucast(data, new UAudioFileDTO()))
  const { fileS, deleteFile } = useUFile((src) => setData(JSON.stringify({ src })))

  if (!fileData.src) return <Drop1zone fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />
  return <UAudio src={fileData.src} onDelete={deleteFile} readonly={readonly} />
}
