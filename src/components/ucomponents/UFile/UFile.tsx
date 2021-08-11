import { Stack, styled, Typography, IconButton } from '@material-ui/core'
import { str } from '../../../utils/types'
import { prevented } from '../../../utils/utils'
import { Dropzone1 } from '../../utils/Dropzone'
import { UBlockComponent } from '../types'
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { useUFile } from './useUFile'

export function UFile({ data, setData, readonly }: UBlockComponent) {
  const { fileS, isUploading, deleteFile } = useUFile(data, setData)
  if (!data) return <Dropzone1 fileS={fileS} isUploading={isUploading} />

  return (
    <FileContainer direction="row" alignItems="center" onClick={() => window?.open(data, '_blank')?.focus()}>
      <AttachFileRoundedIcon />
      <FileName>{fileNameFromFileData(data)}</FileName>
      {!readonly && (
        <Delete onClick={prevented(deleteFile)}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </FileContainer>
  )
}

export function fileNameWithId(fileData: str): str {
  return fileData.split('/').slice(-1)[0]
}

function fileNameFromFileData(fileData: str): str {
  const nameWithId = fileNameWithId(fileData)
  const fileId = nameWithId.split('--').slice(-1)[0]
  return nameWithId.replace('--' + fileId, '') + '.' + fileData.split('.').slice(-1)[0]
}

const Delete = styled(IconButton)({
  marginLeft: 'auto',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
})

const FileName = styled(Typography)({
  fontSize: '1.3rem',
})

const FileContainer = styled(Stack, { label: 'UFile' })(({ theme }) => ({
  width: '100%',
  height: '2.5rem',
  borderRadius: 5,
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
  cursor: 'pointer',
}))
