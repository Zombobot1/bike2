// All resources must be uploaded via this class, it's also used to share blob urls to avoid unnecessary YDoc updates

import { uploadFile } from '../../../fb/storage'
import { deleteFile } from '../../../fb/upageChangesAPI'
import { imageFromSrc, srcfy } from '../../../utils/filesManipulation'
import { str, SetStr, bool, strs, f } from '../../../utils/types'
import { safe } from '../../../utils/utils'

type UploadingFile = { tmpSrc: str; onUpload?: SetStr; uploaded?: bool }

const idAndFile: Map<str, UploadingFile> = new Map()

class FileUploader {
  #deleteFile: (src: str, upageId: str) => void

  constructor(removeFile = deleteFile) {
    this.#deleteFile = removeFile
  }

  uploadFile = (id: str, file: File, onUpload: (url: str) => void) => this.#upload(id, file, onUpload)

  // for image pasted
  uploadBlob = (id: str, blob: Blob, onUpload: (url: str) => void): str => {
    const tmpFile = new File([blob], 'img.png', { type: 'image/png' })
    this.#upload(id, tmpFile, onUpload)
    return srcfy(blob)
  }

  // triggered in UPageState to share src with new UImage
  // TODO: replace with $tmpSrc in UMediaFile to avoid call in UPageState
  prepareUpload = (id: str, blobUrl: str) => {
    idAndFile.set(id, { tmpSrc: blobUrl })
  }

  // onUpload (setSrc) is available only when UImage is mounted -> it is a separate function
  startUpload = (id: str, onUpload: (url: str) => void): str => {
    const data = safe(idAndFile.get(id))
    imageFromSrc(data.tmpSrc).then((f) => this.#upload(id, f, onUpload))
    return data.tmpSrc
  }

  hasImage = (id: str): bool => idAndFile.has(id) // used in new UImage

  // called on unmount
  unsubscribe = (id: str, upageId: str) => {
    if (!idAndFile.has(id)) return

    const data = safe(idAndFile.get(id))
    if (data.uploaded) return idAndFile.delete(id)

    // unmount happened before src was set -> delete file (image component will be broken)
    data.onUpload = (src) => {
      idAndFile.delete(id)
      this.#deleteFile(src, upageId)
    }
  }

  delete = (ids: str | strs, upageId: str) => {
    if (!Array.isArray(ids)) ids = [ids]

    ids.forEach((id) => {
      const data = idAndFile.get(id)
      if (!data || data.uploaded) return this.#deleteFile(id, upageId)

      // delete requested before src was set -> delete file
      data.onUpload = (src) => {
        idAndFile.delete(id)
        this.#deleteFile(src, upageId)
      }
    })
  }

  #upload = (id: str, file: File, onUpload: (url: str) => void) => {
    if (!idAndFile.has(id)) idAndFile.set(id, { tmpSrc: '' })

    const data = safe(idAndFile.get(id))

    uploadFile(file).then((src) => {
      data.uploaded = true
      data.onUpload?.(src)
    })

    // imageFromSrc is async and unmount may happen before it finishes -> onUpload is set to deleteFile
    if (!data.onUpload) data.onUpload = onUpload
  }
}

export let fileUploader = new FileUploader()

export function _mockFileUploader() {
  fileUploader = new FileUploader(f)
  fileUploader.delete([''], '')
  return () => (fileUploader = new FileUploader())
}
