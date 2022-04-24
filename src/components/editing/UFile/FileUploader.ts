// All resources must be uploaded via this class, it's also used to share blob urls to avoid unnecessary YDoc updates

import { uploadFile } from '../../../fb/storage'
import { deleteFile } from '../../../fb/upageChangesAPI'
import { imageFromSrc, srcfy } from '../../../utils/filesManipulation'
import { str, SetStr, bool, f } from '../../../utils/types'
import { safe } from '../../../utils/utils'

type UploadingFile = { onUpload?: SetStr; uploaded?: bool }

export type FileInfos = { blockId: str; src: str }[]
export type DeleteFiles = (fileInfos: FileInfos) => void

const idAndFile: Map<str, UploadingFile> = new Map()

class FileUploader {
  #deleteFile: (src: str, upageId: str) => void

  constructor(removeFile = deleteFile) {
    this.#deleteFile = removeFile
  }

  upload = (id: str, file: File, onUpload: (url: str) => void) => this.#upload(id, file, onUpload)

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

  delete = (fileInfos: FileInfos, upageId: str) => {
    fileInfos.forEach(({ blockId, src }) => {
      const data = idAndFile.get(blockId)
      if (!data || data.uploaded) return this.#deleteFile(src, upageId)

      // delete requested before src was set -> delete file
      data.onUpload = (src) => {
        idAndFile.delete(blockId)
        this.#deleteFile(src, upageId)
      }
    })
  }

  #upload = (id: str, file: File, onUpload: (url: str) => void) => {
    if (!idAndFile.has(id)) idAndFile.set(id, {}) // one UImage can upload multiple files

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
  fileUploader.delete([{ blockId: '', src: '' }], '')
  return () => (fileUploader = new FileUploader())
}
