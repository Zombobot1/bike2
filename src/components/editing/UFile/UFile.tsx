import { Stack, styled, Typography, IconButton } from '@mui/material'
import { ucast, prevented } from '../../../utils/utils'
import { isNotFullWidthBlock, UBlockImplementation } from '../types'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useUFile } from './useUFile'
import { useReactiveObject } from '../../utils/hooks/hooks'
import { _apm } from '../../application/theming/theme'
import { UImageFile } from './UImageFile/UImageFile'
import { UAudioFile } from './UAudioFile/UAudioFile'
import { Drop1zone } from '../../utils/Dropzone/Drop1zone'
import { UVideoFile } from './UVideoFile/UVideoFile'
import { PaddedBox } from '../UBlock/PaddedBox'

export function UFile_({ data, setData, readonly }: UBlockImplementation) {
  const [fileData] = useReactiveObject(ucast(data, new UFileDTO()))
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

export function UFile(ps: UBlockImplementation) {
  const nfw = isNotFullWidthBlock(ps.type)
  return (
    <PaddedBox sx={{ width: nfw ? 'auto' : '100%' }}>
      {ps.type === 'file' && <UFile_ {...ps} />}
      {ps.type === 'image' && <UImageFile {...ps} />}
      {ps.type === 'audio' && <UAudioFile {...ps} />}
      {ps.type === 'video' && <UVideoFile {...ps} />}
    </PaddedBox>
  )
}

const Delete = styled(IconButton)(({ theme }) => ({
  marginLeft: 'auto',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  color: _apm(theme, 'secondary'),
}))

const FileName = styled(Typography)({
  fontSize: '1.3rem',
})

const FileContainer = styled(Stack, { label: 'UFile' })(({ theme }) => ({
  padding: '0.5rem',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: _apm(theme, '100'),
  },
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
  cursor: 'pointer',
}))
