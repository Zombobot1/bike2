import { Stack, styled, Typography, IconButton } from '@material-ui/core'
import { useState } from 'react'
import { api } from '../../../api/api'
import { sslugify } from '../../../utils/sslugify'
import { str } from '../../../utils/types'
import { prevented, uuid } from '../../../utils/utils'
import { Dropzone1, use1Drop } from '../../utils/Dropzone'
import { StrBlockComponent } from '../types'
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'

function fileNameWithId(fileData: str): str {
  return fileData.split('/').slice(-1)[0]
}

function fileNameFromFileData(fileData: str): str {
  const nameWithId = fileNameWithId(fileData)
  const fileId = nameWithId.split('--').slice(-1)[0]
  return nameWithId.replace('--' + fileId, '') + '.' + fileData.split('.').slice(-1)[0]
}

// export interface UFile extends StrBlockComponent {}
export function UFile({ data, setData, readonly }: StrBlockComponent) {
  const [isUploading, setIsUploading] = useState(false)

  const fileS = use1Drop((f) => {
    const ext = f.name.split('.').pop() || ''
    const file = new File([f], `${sslugify(f.name.replace(ext, ''))}-${uuid()}.${ext}`, { type: f.type })

    api.uploadFile(file).then(({ data }) => {
      setData(data)
      setIsUploading(false)
    })
    setIsUploading(true)
  })
  if (!data) return <Dropzone1 fileS={fileS} isUploading={isUploading} />

  return (
    <FileDiv direction="row" alignItems="center" onClick={() => window?.open(data, '_blank')?.focus()}>
      <AttachFileRoundedIcon />
      <FileName>{fileNameFromFileData(data)}</FileName>
      {!readonly && (
        <Delete onClick={prevented(() => api.deleteFile(fileNameWithId(data)).then(() => setData('')))}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </FileDiv>
  )
}

const Delete = styled(IconButton)({
  marginLeft: 'auto',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
})

const FileName = styled(Typography)({
  fontSize: '1.3rem',
})

const FileDiv = styled(Stack, { label: 'UFile' })(({ theme }) => ({
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
