import { useState } from 'react'
import { SetBool, SetStr, str } from '../../../utils/types'
import { use1Drop, use1ImageDrop } from '../../utils/Dropzone/Drop1zone'
import { useMount } from '../../utils/hooks/hooks'
import { fileUploader } from './FileUploader'

type SetFile = (f: File) => void
type SetSrc = (src: str, fileName?: str) => void

export function useUFile(id: str, setSrc: SetSrc) {
  const [isUploading, setIsUploading] = useState(false)
  const fileS = use1Drop(getUploader(id, setSrc, setIsUploading))
  return { isUploading, fileS, deleteFile: fileUploader.delete }
}

export function useUImageFile(id: str, upageId: str, onUpload: SetStr, showTmpImage?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const uploadFile = getUploader(id, onUpload, setIsUploading, showTmpImage)
  const { fileS, readFromKeyboard } = use1ImageDrop(uploadFile)
  useMount(() => () => fileUploader.unsubscribe(id, upageId))
  return { isUploading, fileS, readFromKeyboard, deleteFile: fileUploader.delete, uploadFile }
}

const getUploader = (id: str, setSrc: SetSrc, setIsUploading: SetBool, handleFile?: SetFile) => async (f: File) => {
  if (handleFile) handleFile(f) // set tmpImage while its uploading

  setIsUploading(true)
  fileUploader.upload(id, f, (src) => {
    setSrc(src, f.name)
    setIsUploading(false)
  })
}
