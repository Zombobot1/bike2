import { useReactive, useReactiveObject } from '../../../utils/hooks/hooks'
import AudiotrackRoundedIcon from '@material-ui/icons/AudiotrackRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponent } from '../../types'
import { Dropzone1 } from '../../../utils/Dropzone'
import { IconButton, Stack, styled } from '@material-ui/core'
import { useUFile } from '../useUFile'
import { apm } from '../../../application/theming/theme'
import { UAudio } from '../../../utils/UAudio/UAudio'
import { cast } from '../../../../utils/utils'

export class UAudioFileDTO {
  src = ''
}

export function UAudioFile({ data, setData, readonly }: UBlockComponent) {
  const [fileData] = useReactiveObject(cast(data, new UAudioFileDTO()))
  const { fileS, deleteFile } = useUFile((src) => setData(JSON.stringify({ src })))

  if (!fileData.src) return <Dropzone1 fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />
  return <UAudio src={fileData.src} onDelete={deleteFile} readonly={readonly} />
}
