import { ref, uploadBytes } from '@firebase/storage'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, getStorage } from 'firebase/storage'
import { srcfy } from '../utils/filesManipulation'
import { sslugify } from '../utils/sslugify'
import { strP } from '../utils/types'
import { uuid } from '../utils/wrappers/uuid'
import { isInProduction } from './utils'

export async function uploadFile(file: File): strP {
  if (file.type.split('/')[0] === 'image') {
    file = await imageCompression(file, {
      useWebWorker: true,
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    })
  }
  const ext = file.name.split('.').pop() || ''
  return _uploadFile(new File([file], `${sslugify(file.name.replace(ext, ''))}-${uuid()}.${ext}`, { type: file.type }))
}

async function _uploadFile(file: File): strP {
  if (!isInProduction) return Promise.resolve(srcfy(file))

  await uploadBytes(ref(getStorage(), file.name), file)
  return getDownloadURL(ref(getStorage(), file.name))
}
