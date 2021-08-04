import { styled, Typography } from '@material-ui/core'
import { useState } from 'react'
import { api } from '../../../api/api'
import { sslugify } from '../../../utils/sslugify'
import { str } from '../../../utils/types'
import { uuid } from '../../../utils/utils'
import { Dropzone1, use1Drop } from '../../utils/Dropzone'
import { StrBlockComponent } from '../types'
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded'

function fileNameFromFileData(fileData: str): str {
  return fileData
}

// export interface UFile extends StrBlockComponent {}
export function UFile({ data, setData }: StrBlockComponent) {
  const [isUploading, setIsUploading] = useState(false)

  const fileS = use1Drop((f) => {
    const ext = f.name.split('.').pop()
    const file = new File([f], `${sslugify(f.name)}-${uuid()}.${ext}`, { type: f.type })
    api.uploadFile(file).then(({ src }) => {
      setData(src)
      setIsUploading(false)
    })
    setIsUploading(true)
  })
  if (!data) return <Dropzone1 fileS={fileS} isUploading={isUploading} />

  return (
    <FileDiv>
      <Typography>
        <AttachFileRoundedIcon />
        {fileNameFromFileData(data)}
      </Typography>
    </FileDiv>
  )
}

const FileDiv = styled('div', { label: 'UFile' })(({ theme }) => ({
  width: '100%',
  height: '5rem',
  borderRadius: 5,
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
  cursor: 'pointer',
  fontSize: '1.5rem',
}))
