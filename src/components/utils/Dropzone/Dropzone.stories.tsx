import { Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { all, wait } from '../../../utils/utils'
import { useToggle } from '../hooks/hooks'
import { Drop1zone, use1Drop } from './Drop1zone'

const T =
  (isInUploading = false) =>
  () => {
    const [isUploading, toggleIsUploading] = useToggle(isInUploading)
    const [name, setName] = useState('')
    const fileS = use1Drop((f) => {
      toggleIsUploading()
      wait(1000).then(all(() => setName(f.name), toggleIsUploading))
    })

    return (
      <Stack spacing={2} sx={{ width: 500 }}>
        {name && <Typography>Uploaded: {name}</Typography>}
        <Drop1zone fileS={fileS} isUploading={isUploading} />
      </Stack>
    )
  }

export const UploadsFile = T()
export const UploadingFile = T(true)

export default {
  title: 'Utils/Dropzone',
}
