import { ref, uploadBytes } from '@firebase/storage'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, getStorage } from 'firebase/storage'
import { srcfy } from '../utils/filesManipulation'
import { sslugify } from '../utils/sslugify'
import { bool, strP } from '../utils/types'
import { uuid } from '../utils/uuid'
import { _MOCK_FB } from './utils'

export async function _uploadFile(file: File): strP {
  if (process.env.NODE_ENV === 'development' && _MOCK_FB) return Promise.resolve(srcfy(file))
  await uploadBytes(ref(getStorage(), file.name), file)
  return getDownloadURL(ref(getStorage(), file.name))
}

export async function uploadFile(file: File, options?: { compress?: bool }): strP {
  if (options?.compress) {
    file = await imageCompression(file, {
      useWebWorker: true,
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    })
  }
  const ext = file.name.split('.').pop() || ''
  return _uploadFile(
    new File([file], `${sslugify(file.name.replace(ext, ''))}-${uuid.v4()}.${ext}`, { type: file.type }),
  )
}
