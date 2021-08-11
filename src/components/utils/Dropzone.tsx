import { ReactNode, useCallback, useEffect, useState } from 'react'
import { IconButton, Stack, styled, Typography } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import { bool, Files, Fn, fn, OFile, State, str } from '../../utils/types'
import UploadFileRoundedIcon from '@material-ui/icons/UploadFileRounded'
import ContentPasteRoundedIcon from '@material-ui/icons/ContentPasteRounded'
import { prevented } from '../../utils/utils'
import { readImageFromKeyboard } from '../../utils/filesManipulation'
import { uuid } from '../../utils/uuid'

export function use1Drop(onDrop: (f: File) => void): State<OFile> {
  const [file, setFile] = useState<OFile>(null)
  useEffect(() => {
    if (file) onDrop(file)
  }, [file])

  return [file, setFile]
}

export function use1ImageDrop(onDrop: (f: File) => void) {
  const fileS = use1Drop(onDrop)
  const readFromKeyboard = readImageFromKeyboard(onDrop)
  return { fileS, readFromKeyboard }
}

interface Dropzone_ {
  icon?: ReactNode
  label?: str
  readFromKeyboard?: Fn
  isUploading?: bool
}

export interface Dropzone1 extends Dropzone_ {
  fileS: State<OFile>
}

export function Dropzone1(props: Dropzone1) {
  const [_, setFile] = props.fileS
  const filesS = useState<Files>([])
  useEffect(() => setFile(filesS[0][0]), [JSON.stringify(filesS[0])])
  return <Dropzone filesS={filesS} {...props} label={props.label || 'file'} />
}

export interface Dropzone extends Dropzone_ {
  filesS: State<Files>
}

export function Dropzone({ filesS, label = 'files', readFromKeyboard, icon, isUploading }: Dropzone) {
  const [_, setFiles] = filesS
  const onDrop = useCallback((fs: Files) => setFiles(fs), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const id = uuid()
  return (
    <DropArea {...getRootProps()} alignItems="center" justifyContent="center" direction="row" spacing={1}>
      <input id={id} {...getInputProps()} />
      {isDragActive && <Typography>Drop the files here ...</Typography>}
      {!isDragActive && (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {isUploading && <Typography>Uploading...</Typography>}
          {!isUploading && !icon && <UploadFileRoundedIcon />}
          {!isUploading && icon}
          {!isUploading && (
            <Typography component="label" htmlFor={id}>
              Drop {label} here, or click to select
            </Typography>
          )}
          {!isUploading && Boolean(readFromKeyboard) && (
            <>
              <Vr />
              <IconButton onClick={prevented(readFromKeyboard || fn)}>
                <ContentPasteRoundedIcon />
              </IconButton>
            </>
          )}
        </Stack>
      )}
    </DropArea>
  )
}

const Vr = styled('div')(({ theme }) => ({
  height: '25px',
  width: '8px',
  borderRight: `1px solid ${theme.palette.grey['500']}`,
}))

const DropArea = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '70px',
  borderRadius: 5,
  backgroundColor: theme.palette.grey[50],
  color: theme.palette.grey[500],
  cursor: 'pointer',
}))
