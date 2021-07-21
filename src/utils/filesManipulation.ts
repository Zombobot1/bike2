import { useState } from 'react'
import { str, OBlob, OBlobP } from './types'

export function srcfy(blob: Blob): str {
  return URL.createObjectURL(blob)
}

async function retrieveImageFromClipboard(items: ClipboardItems): OBlobP {
  if (!items.length) return null

  for (let i = 0; i < items.length; i++) {
    try {
      return await items[i].getType('image/png')
    } catch (error) {
      console.error(error)
    }
  }
  return null
}

async function retrieveImageFromClipboardAsBlob(data: ClipboardItems): Promise<[str, OBlob]> {
  const image = await retrieveImageFromClipboard(data)
  if (!image) return ['', null]
  return [srcfy(image), image]
}

export function useImageFromClipboard() {
  const [clipBoardImageSrc, setClipBoardImageSrc] = useState('')
  const [clipBoardImage, setClipBoardImage] = useState<OBlob>(null)

  async function retrieveImage(data: ClipboardItems) {
    const [img, file] = await retrieveImageFromClipboardAsBlob(data)
    if (img) {
      setClipBoardImageSrc(img)
      setClipBoardImage(file)
    }
  }

  return { clipBoardImageSrc, clipBoardImage, retrieveImage }
}
