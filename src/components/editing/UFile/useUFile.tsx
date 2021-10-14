import { useState } from 'react'
import { sslugify } from '../../../utils/sslugify'
import { bool, SetBool, SetStr, str } from '../../../utils/types'
import { uuid } from '../../../utils/uuid'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { uploadFile } from '../../../fb/storage'
import { use1Drop, use1ImageDrop } from '../../utils/Dropzone/Drop1zone'

type SetFile = (f: File) => void
type SetSrc = (src: str, fileName?: str) => void

export function useUFile(setSrc: SetSrc, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const fileS = use1Drop(upload(setSrc, setIsUploading, handleFile))
  return { isUploading, fileS, deleteFile: () => setSrc('') }
}

export function useUImageFile(setSrc: SetStr, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const uploadFile = upload(setSrc, setIsUploading, handleFile, true)
  const { fileS, readFromKeyboard } = use1ImageDrop(uploadFile)
  return { isUploading, fileS, readFromKeyboard, deleteFile: () => setSrc(''), uploadFile }
}

const upload = (setSrc: SetSrc, setIsUploading: SetBool, handleFile?: SetFile, compress?: bool) => async (f: File) => {
  if (handleFile) handleFile(f)
  setIsUploading(true)
  const url = await uploadFile(f, { compress })
  setSrc(url, f.name)
  setIsUploading(false)
}
