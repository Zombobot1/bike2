import { useState } from 'react'
import { sslugify } from '../../../utils/sslugify'
import { bool, SetBool, SetStr, str } from '../../../utils/types'
import { uuid } from '../../../utils/uuid'
import { use1Drop, use1ImageDrop } from '../../utils/Dropzone'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

type SetFile = (f: File) => void
type SetSrc = (src: str, fileName?: str) => void

export function useUFile(setSrc: SetSrc, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const fileS = use1Drop(upload(setSrc, setIsUploading, handleFile))
  return { isUploading, fileS, deleteFile: () => setSrc('') }
}

export function useUImageFile(setSrc: SetStr, handleFile?: SetFile) {
  const [isUploading, setIsUploading] = useState(false)
  const { fileS, readFromKeyboard } = use1ImageDrop(upload(setSrc, setIsUploading, handleFile, true))
  return { isUploading, fileS, readFromKeyboard, deleteFile: () => setSrc('') }
}

const upload = (setSrc: SetSrc, setIsUploading: SetBool, handleFile?: SetFile, compress?: bool) => async (f: File) => {
  if (handleFile) handleFile(f)
  setIsUploading(true)
  if (compress) {
    f = await imageCompression(f, {
      useWebWorker: true,
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    })
  }

  const ext = f.name.split('.').pop() || ''
  const file = new File([f], `${sslugify(f.name.replace(ext, ''))}-${uuid.v4()}.${ext}`, { type: f.type })

  await uploadBytes(ref(getStorage(), file.name), file)
  const url = await getDownloadURL(ref(getStorage(), file.name))
  setSrc(url, f.name)
  setIsUploading(false)
}
