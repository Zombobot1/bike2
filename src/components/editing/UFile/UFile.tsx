import { Stack, styled, Typography, IconButton, alpha, Box } from '@mui/material'
import { str } from '../../../utils/types'
import { cast, prevented } from '../../../utils/utils'
import { UBlockComponent, UBlockComponentB } from '../types'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useUFile } from './useUFile'
import { useReactive, useReactiveObject } from '../../utils/hooks/hooks'
import { apm } from '../../application/theming/theme'
import { UImageFile } from './UImageFile/UImageFile'
import { UAudioFile } from './UAudioFile/UAudioFile'
import { Drop1zone } from '../../utils/Dropzone/Drop1zone'

export class UFileDTO {
  src = ''
  name = ''
}

export function UFile_({ data, setData, readonly }: UBlockComponentB) {
  const [fileData] = useReactiveObject(cast(data, new UFileDTO()))
  const { fileS, isUploading, deleteFile } = useUFile((src, name) => setData(JSON.stringify({ name, src })))
  if (!fileData.src || isUploading) return <Drop1zone fileS={fileS} isUploading={isUploading} />

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

export function UFile(props: UBlockComponent) {
  return (
    <Box sx={{ paddingBottom: '1rem' }}>
      {props.type === 'FILE' && <UFile_ {...props} />}
      {props.type === 'IMAGE' && <UImageFile {...props} />}
      {props.type === 'AUDIO' && <UAudioFile {...props} />}
    </Box>
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
