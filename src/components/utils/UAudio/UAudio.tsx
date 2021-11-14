import { Box, Collapse, IconButton, Slider, Stack, styled, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMount, useToggle } from '../hooks/hooks'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import { all } from '../../../utils/utils'
import { bool, Fn, num, str } from '../../../utils/types'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { _apm } from '../../application/theming/theme'

export interface UAudio {
  src: str
  onDelete: Fn
  readonly?: bool
}

export function UAudio({ src, onDelete, readonly }: UAudio) {
  const [audio] = useState(new Audio(src))
  const [isPlaying, togglePlay] = useToggle()
  const [isReady, toggleReady] = useToggle()
  const [isMuted, toggleMute] = useToggle()
  const [specifiedTime, setSpecifiedTime] = useState(-1)
  const [currentTime, setCurrentTime] = useState(0)
  const [showVolume, toggleVolume] = useToggle()
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    audio.volume = volume / 100
  }, [volume])

  useEffect(() => {
    audio.muted = isMuted
  }, [isMuted])

  useMount(() => {
    const update = () => setCurrentTime(audio.currentTime)
    audio.addEventListener('timeupdate', update)
    const cleanTime = () => audio.removeEventListener('timeupdate', update)

    const ready = () => toggleReady()
    audio.addEventListener('loadedmetadata', ready)
    const cleanReady = () => audio.removeEventListener('loadedmetadata', ready)

    return () => {
      cleanTime()
      cleanReady()
    }
  })

  return (
    <UAudio_ direction="row" alignItems="center">
      <IconButton color="primary" onClick={all(togglePlay, isPlaying ? () => audio.pause() : () => audio.play())}>
        {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
      </IconButton>
      <Typography sx={{ fontSize: '0.85rem', minWidth: '5rem', marginLeft: '0.25rem', marginRight: '0.25rem' }}>
        {isReady ? time(currentTime, audio.duration) : ''}
      </Typography>
      <StraightSlider
        size="small"
        value={specifiedTime > -1 ? specifiedTime : currentTime}
        max={isReady ? audio.duration : 0}
        onFocus={() => setSpecifiedTime(currentTime)}
        onChange={(_, v) => setSpecifiedTime(v as num)}
        onChangeCommitted={() => {
          audio.currentTime = specifiedTime
          setSpecifiedTime(-1)
        }}
      />
      <Stack
        direction="row"
        alignItems="center"
        sx={{ marginLeft: showVolume ? '1rem' : '0.5rem', cursor: 'pointer' }}
        onMouseEnter={toggleVolume}
        onMouseLeave={toggleVolume}
      >
        <Collapse in={showVolume} orientation="horizontal" timeout={300} style={{ backgroundColor: '' }}>
          <Box style={{ minWidth: '4rem', paddingRight: '1rem', paddingTop: '8px' }}>
            <StraightSlider size="small" value={volume} onChange={(_, v) => setVolume(v as num)} />
          </Box>
        </Collapse>
        <IconButton color="primary" onClick={toggleMute}>
          {isMuted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
        </IconButton>
      </Stack>
      {!readonly && (
        <Delete onClick={onDelete}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </UAudio_>
  )
}

const UAudio_ = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '0.5rem',
  backgroundColor: _apm(theme, '100'),
}))

const StraightSlider = styled(Slider)({
  ':hover .MuiSlider-thumb': {
    opacity: 1,
  },
  '.MuiSlider-thumb': {
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
})

const Delete = styled(IconButton)(({ theme }) => ({
  color: _apm(theme, 'secondary'),
}))

function time(current: num, duration: num): str {
  const calculateTime = (secs: num): str => {
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${minutes}:${returnedSeconds}`
  }
  return `${calculateTime(current)} / ${calculateTime(duration)}`
}
