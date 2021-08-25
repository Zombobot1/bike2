import { useEffectedState } from '../../../utils/hooks/hooks'
import AudiotrackRoundedIcon from '@material-ui/icons/AudiotrackRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponent } from '../../types'
import { Dropzone1 } from '../../../utils/Dropzone'
import { Stack, styled } from '@material-ui/core'
import { useUFile } from '../useUFile'

export function UAudioFile({ data, setData }: UBlockComponent) {
  const [src, setSrc] = useEffectedState(data)
  const { fileS, deleteFile: _ } = useUFile(data, setData, (f) => setSrc(srcfy(f)))

  if (!src) return <Dropzone1 fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />

  return (
    <AudioContainer alignItems="center" justifyContent="center" direction="row">
      <audio src={src} controls />
      {/* {!readonly && (
        <Delete aria-label="delete" onClick={deleteFile}>
          <DeleteRoundedIcon />
        </Delete>
      )} */}
    </AudioContainer>
  )
}

const AudioContainer = styled(Stack, { label: 'UAudioFile' })({
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
})

// const Delete = styled(IconButton)({
//   opacity: 0,
//   transition: 'opacity 0.2s ease-in-out',
// })
