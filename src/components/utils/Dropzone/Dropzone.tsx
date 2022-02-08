import { ReactNode, useCallback } from 'react'
import { CircularProgress, IconButton, Stack, styled, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { bool, Files, Fn, f, State, str } from '../../../utils/types'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded'
import { prevented } from '../../../utils/utils'
import { _apm } from '../../application/theming/theme'
import { useIsSM } from '../hooks/hooks'

export interface DropzoneB {
  icon?: ReactNode
  label?: str
  readFromKeyboard?: Fn
  isUploading?: bool
}

export interface Dropzone extends DropzoneB {
  filesS: State<Files>
}

// if a label is added select file menu appears twice (due to click on the label)
export function Dropzone({ filesS, label = 'files', readFromKeyboard, icon, isUploading }: Dropzone) {
  const [_, setFiles] = filesS
  const onDrop = useCallback((fs: Files) => setFiles(fs), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: isUploading })
  const isSM = useIsSM()
  if (!isSM) return null
  return (
    <DropArea
      {...getRootProps()}
      alignItems="center"
      justifyContent="center"
      direction="row"
      spacing={1}
      sx={{ cursor: isUploading ? 'default' : 'pointer' }}
    >
      <input {...getInputProps()} />
      {isDragActive && <Typography>Drop the files here ...</Typography>}
      {!isDragActive && (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {isUploading && (
            <>
              <Typography sx={{ marginRight: '0.5rem' }}>Uploading...</Typography>
              <CircularProgress size="1.4rem" />
            </>
          )}
          {!isUploading && !icon && <UploadFileRoundedIcon />}
          {!isUploading && icon}
          {!isUploading && <Typography>Drop {label} here, or click to select</Typography>}
          {!isUploading && Boolean(readFromKeyboard) && (
            <>
              <Vr />
              <IconButton color="primary" onClick={prevented(readFromKeyboard || f)}>
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
  height: '70px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: _apm(theme, '100'),
  color: theme.palette.primary.main,
}))
