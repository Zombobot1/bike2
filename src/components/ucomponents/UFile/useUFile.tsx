import { useState } from 'react'
import { api } from '../../../api/api'
import { sslugify } from '../../../utils/sslugify'
import { bool, SetStr, str } from '../../../utils/types'
import { uuid } from '../../../utils/utils'
import { use1Drop, use1ImageDrop } from '../../utils/Dropzone'
import { fileNameWithId } from './UFile'

type SetFile = (f: File) => void

export function useUFile(data: str, setData: SetStr, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const fileS = use1Drop(upload(setData, setIsUploading, handleFile))
  return { isUploading, fileS, deleteFile: deleteFile(data, setData) }
}

export function useUImageFile(data: str, setData: SetStr, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const { fileS, readFromKeyboard } = use1ImageDrop(upload(setData, setIsUploading, handleFile))
  return { isUploading, fileS, readFromKeyboard, deleteFile: deleteFile(data, setData) }
}

const upload = (setData: SetStr, setIsUploading: (d: bool) => void, handleFile?: SetFile) => (f: File) => {
  if (handleFile) handleFile(f)

  const ext = f.name.split('.').pop() || ''
  const file = new File([f], `${sslugify(f.name.replace(ext, ''))}-${uuid()}.${ext}`, { type: f.type })

  api.uploadFile(file).then(({ data }) => {
    setData(data)
    setIsUploading(false)
  })
  setIsUploading(true)
}

const deleteFile = (data: str, setData: SetStr) => () => api.deleteFile(fileNameWithId(data)).then(() => setData(''))
