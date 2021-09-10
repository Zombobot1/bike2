import { Stack, styled, Typography, IconButton, alpha } from '@material-ui/core'
import { str } from '../../../utils/types'
import { cast, prevented } from '../../../utils/utils'
import { Dropzone1 } from '../../utils/Dropzone'
import { UBlockComponent } from '../types'
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { useUFile } from './useUFile'
import { useReactive, useReactiveObject } from '../../utils/hooks/hooks'
import { apm } from '../../application/theming/theme'

export class UFileDTO {
  src = ''
  name = ''
}

export function UFile({ data, setData, readonly }: UBlockComponent) {
  const [fileData] = useReactiveObject(cast(data, new UFileDTO()))
  const { fileS, isUploading, deleteFile } = useUFile((src, name) => setData(JSON.stringify({ name, src })))
  if (!fileData.src || isUploading) return <Dropzone1 fileS={fileS} isUploading={isUploading} />

  return (
    <FileContainer direction="row" alignItems="center" onClick={() => window?.open(fileData.src, '_blank')?.focus()}>
      <AttachFileRoundedIcon />
      <FileName>{fileData.name}</FileName>
      {!readonly && (
        <Delete onClick={prevented(deleteFile)}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </FileContainer>
  )
}

const Delete = styled(IconButton)(({ theme }) => ({
  marginLeft: 'auto',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  color: apm(theme, 'SECONDARY'),
}))

const FileName = styled(Typography)({
  fontSize: '1.3rem',
})

const FileContainer = styled(Stack, { label: 'UFile' })(({ theme }) => ({
  padding: '0.5rem',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: apm(theme, '100'),
  },
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
  cursor: 'pointer',
}))
