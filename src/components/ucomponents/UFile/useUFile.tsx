import { useState } from 'react'
import { api } from '../../../api/api'
import { sslugify } from '../../../utils/sslugify'
import { str } from '../../../utils/types'
import { uuid } from '../../../utils/utils'
import { use1Drop } from '../../utils/Dropzone'
import { fileNameWithId } from './UFile'

export function useUFile(data: str, setData: (d: str) => void, handleFile?: (f: File) => void) {
  const [isUploading, setIsUploading] = useState(false)

  const fileS = use1Drop((f) => {
    if (handleFile) handleFile(f)

    const ext = f.name.split('.').pop() || ''
    const file = new File([f], `${sslugify(f.name.replace(ext, ''))}-${uuid()}.${ext}`, { type: f.type })

    api.uploadFile(file).then(({ data }) => {
      setData(data)
      setIsUploading(false)
    })
    setIsUploading(true)
  })

  const deleteFile = () => api.deleteFile(fileNameWithId(data)).then(() => setData(''))

  return { isUploading, fileS, deleteFile }
}
