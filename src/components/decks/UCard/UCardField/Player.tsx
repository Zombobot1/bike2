import { useCallback, useEffect, useState } from 'react'
import { IconButton, Stack, styled, Typography } from '@material-ui/core'
import PlayCircleRoundedIcon from '@material-ui/icons/PlayCircleRounded'
import PauseCircleRoundedIcon from '@material-ui/icons/PauseCircleRounded'
import { PassiveData } from './types'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { useDropzone } from 'react-dropzone'
import { Files, OFile, StateT } from '../../../../utils/types'
import { srcfy } from '../../../../utils/filesManipulation'
import UploadFileRoundedIcon from '@material-ui/icons/UploadFileRounded'

export interface Player extends PassiveData {
  autoplay?: boolean
}

export function Player({ data, canBeEdited, name, autoplay = false }: Player) {
  const [src, setSrc] = useState(data)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>()
  const [isPlaying, setIsPlaying] = useState(false)
  const fileS = use1Drop((f) => setSrc(srcfy(f)))

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
          <IconButton color="error" onClick={() => setSrc('')}>
            <DeleteRoundedIcon />
          </IconButton>
        )}
      </Stack>
    )
  return <Dropzone1 fileS={fileS} label={name} />
}

function use1Drop(onDrop: (f: File) => void): StateT<OFile> {
  const [file, setFile] = useState<OFile>(null)
  useEffect(() => {
    if (file) onDrop(file)
  }, [file])

  return [file, setFile]
}

export interface Dropzone1 {
  label?: string
  fileS: StateT<OFile>
}

function Dropzone1({ fileS, label }: Dropzone1) {
  const [_, setFile] = fileS
  const filesS = useState<Files>([])
  useEffect(() => setFile(filesS[0][0]), [JSON.stringify(filesS[0])])
  return <Dropzone filesS={filesS} label={label} />
}

export interface Dropzone {
  label?: string
  filesS: StateT<Files>
}

function Dropzone({ filesS, label = 'files' }: Dropzone) {
  const [_, setFiles] = filesS
  const onDrop = useCallback((fs: Files) => setFiles(fs), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <DropArea {...getRootProps()} alignItems="center" justifyContent="center" direction="row" spacing={1}>
      <input {...getInputProps()} />
      {isDragActive && <Typography>Drop the files here ...</Typography>}
      {!isDragActive && (
        <>
          <UploadFileRoundedIcon />
          <Typography>Drop {label} here, or click to select</Typography>
        </>
      )}
    </DropArea>
  )
}

const DropArea = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '70px',
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  cursor: 'pointer',
}))
