import { useEffectedState } from '../../../../utils/hooks-utils'
import AudiotrackRoundedIcon from '@material-ui/icons/AudiotrackRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import PlayCircleRoundedIcon from '@material-ui/icons/PlayCircleRounded'
import PauseCircleRoundedIcon from '@material-ui/icons/PauseCircleRounded'
import { UBlockComponent } from '../../types'
import { useEffect, useState } from 'react'
import { Dropzone1 } from '../../../utils/Dropzone'
import { IconButton, Stack, styled } from '@material-ui/core'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { useUFile } from '../useUFile'

export function UAudioFile({ data, setData, readonly }: UBlockComponent) {
  const [src, setSrc] = useEffectedState(data)
  const { fileS, deleteFile } = useUFile(data, setData, (f) => setSrc(srcfy(f)))

  const [audioElement, setAudioElement] = useState<HTMLAudioElement>()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!src) return

    const audioFile = new Audio(src)
    setAudioElement(audioFile)
    audioFile.load()
    const el = () => setIsPlaying(false)
    audioFile.addEventListener('ended', el)

    return () => audioFile.removeEventListener('ended', el)
  }, [src])

  if (!src) return <Dropzone1 fileS={fileS} label="audio" icon={<AudiotrackRoundedIcon />} />

  const play = () => {
    setIsPlaying(true)
    audioElement?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    audioElement?.pause()
  }

  const sx = { width: 50, height: 50 }

  return (
    <AudioContainer alignItems="center" justifyContent="center" direction="row">
      {!isPlaying && (
        <IconButton aria-label="play" color="primary" onClick={play}>
          <PlayCircleRoundedIcon sx={sx} />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton aria-label="stop" color="primary" onClick={pause}>
          <PauseCircleRoundedIcon sx={sx} />
        </IconButton>
      )}
      {!readonly && (
        <Delete aria-label="delete" onClick={deleteFile}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </AudioContainer>
  )
}

const AudioContainer = styled(Stack, { label: 'UAudioFile' })({
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
})

const Delete = styled(IconButton)({
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
})
