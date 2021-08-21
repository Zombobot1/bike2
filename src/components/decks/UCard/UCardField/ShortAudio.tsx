import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded'
import PauseRoundedIcon from '@material-ui/icons/PauseRounded'
import { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core'
import { bool, str } from '../../../../utils/types'

export interface ShortAudio {
  src: str
  autoplay?: bool
}

export function ShortAudio({ src, autoplay }: ShortAudio) {
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

  const sx = { width: 30, height: 30 }

  return (
    <>
      {!isPlaying && (
        <IconButton aria-label="play" color="primary" onClick={play}>
          <VolumeUpRoundedIcon sx={sx} />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton aria-label="stop" color="primary" onClick={pause}>
          <PauseRoundedIcon sx={sx} />
        </IconButton>
      )}
    </>
  )
}
