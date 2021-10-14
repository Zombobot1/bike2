import { useReactive, useReactiveObject } from '../../../utils/hooks/hooks'
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponentB } from '../../types'
import { IconButton, Stack, styled } from '@mui/material'
import { useUFile } from '../useUFile'
import { apm } from '../../../application/theming/theme'
import { UAudio } from '../../../utils/UAudio/UAudio'
import { cast } from '../../../../utils/utils'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'

export class UAudioFileDTO {
  src = ''
}

export function UAudioFile({ data, setData, readonly }: UBlockComponentB) {
  const [fileData] = useReactiveObject(cast(data, new UAudioFileDTO()))
  const { fileS, deleteFile } = useUFile((src) => setData(JSON.stringify({ src })))

  if (!fileData.src) return <Drop1zone fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />
  return <UAudio src={fileData.src} onDelete={deleteFile} readonly={readonly} />
}
