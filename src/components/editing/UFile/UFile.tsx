import { Stack, styled, Typography, IconButton } from '@mui/material'
import { prevented } from '../../../utils/utils'
import { UBlockContent } from '../types'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useUFile } from './useUFile'
import { _apm } from '../../application/theming/theme'
import { UImageFile } from './UImageFile/UImageFile'
import { UAudioFile } from './UAudioFile/UAudioFile'
import { Drop1zone } from '../../utils/Dropzone/Drop1zone'
import { UVideoFile } from './UVideoFile/UVideoFile'
import { PaddedBox } from '../UPage/UBlock/PaddedBox'
import { isNotFullWidthBlock, UFileData } from '../UPage/ublockTypes'
import { UFile as UFileP } from "./types";

export function UFile_({ id, data: d, setData, readonly, upageId }: UFile) {
  const data = d as UFileData
  const { fileS, isUploading, deleteFile } = useUFile(id, (src, name) => setData(id, { name, src }))
  if (!data.src || isUploading) return <Drop1zone fileS={fileS} isUploading={isUploading} />

  return (
    <FileContainer direction="row" alignItems="center" onClick={() => window?.open(data.src, '_blank')?.focus()}>
      <AttachFileRoundedIcon />
      <FileName>{data.name}</FileName>
      {!readonly && (
        <Delete
          onClick={prevented(() => {
            setData(id, { src: '' })
            deleteFile(id, upageId)
          })}
        >
          <DeleteRoundedIcon />
        </Delete>
      )}
    </FileContainer>
  )
}

export function UFile(ps: UFileP) {
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
