import { useEffect, useState } from 'react'
import { IconButton, Stack } from '@material-ui/core'
import PlayCircleRoundedIcon from '@material-ui/icons/PlayCircleRounded'
import PauseCircleRoundedIcon from '@material-ui/icons/PauseCircleRounded'
import { PassiveData } from './types'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { Dropzone1, use1Drop } from '../../../utils/Dropzone'
import AudiotrackRoundedIcon from '@material-ui/icons/AudiotrackRounded'

export interface UAudioField extends PassiveData {
  autoplay?: boolean
}

export function UAudioField({ data, canBeEdited, name, autoplay = false, setValue }: UAudioField) {
  const [src, setSrc] = useState(data)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>()
  const [isPlaying, setIsPlaying] = useState(false)

  const fileS = use1Drop((f) => {
    setSrc(srcfy(f))
    setValue(f)
  })

  const play = () => {
    setIsPlaying(true)
    audioElement?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    audioElement?.pause()
  }

  useEffect(() => {
    if (src && autoplay) play()
  }, [audioElement, autoplay])

  useEffect(() => {
    if (!src) return
    const audioFile = new Audio(src)
    setAudioElement(audioFile)
    audioFile.load()

    audioFile.addEventListener('ended', () => setIsPlaying(false))
  }, [src])

  const sx = { width: 50, height: 50 }

  if (src)
    return (
      <Stack alignItems="center" justifyContent="center" direction="row">
        {!isPlaying && (
          <IconButton color="primary" onClick={play}>
            <PlayCircleRoundedIcon sx={sx} />
          </IconButton>
        )}
        {isPlaying && (
          <IconButton color="primary" onClick={pause}>
            <PauseCircleRoundedIcon sx={sx} />
          </IconButton>
        )}
        {canBeEdited && (
          <IconButton
            color="error"
            onClick={() => {
              setSrc('')
              setValue('')
            }}
          >
            <DeleteRoundedIcon />
          </IconButton>
        )}
      </Stack>
    )
  return <Dropzone1 fileS={fileS} label={name} icon={<AudiotrackRoundedIcon />} />
}
