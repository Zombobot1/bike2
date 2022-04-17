import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded'
import { UBlockContent } from '../../types'
import { useUFile } from '../useUFile'
import { UAudio } from '../../../utils/UAudio/UAudio'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'
import { UAudioFileData } from '../../UPage/ublockTypes'
import { UFile } from '../types'

export function UAudioFile({ id, data: d, setData, readonly, upageId }: UFile) {
  const data = d as UAudioFileData
  const { fileS, deleteFile } = useUFile(id, (src) => setData(id, { src }))

  if (!data.src) return <Drop1zone fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />
  return (
    <UAudio
      src={data.src}
      onDelete={() => {
        setData(id, { src: '' })
        deleteFile(id, upageId)
      }}
      readonly={readonly}
    />
  )
}
