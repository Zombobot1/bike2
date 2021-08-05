import { useState } from 'react'
import { str, OBlobP, OFile } from './types'

export function srcfy(blob: Blob): str {
  return URL.createObjectURL(blob)
}

async function retrieveImageFromClipboard(items: ClipboardItems): OBlobP {
  for (let i = 0; i < items.length; i++) {
    try {
      return await items[i].getType('image/png')
    } catch (error) {
      console.error(error)
    }
  }
  return null
}

export function readImageFromKeyboard(onRead: (f: File) => void) {
  async function retrieveImage(data: ClipboardItems) {
    const imageBlob = await retrieveImageFromClipboard(data)
    if (imageBlob) onRead(new File([imageBlob], `img.png`))
  }
  return () => navigator.clipboard.read().then(retrieveImage).catch(console.error)
}

export function useImageFromClipboard(_fileName: str) {
  const [clipBoardImageSrc] = useState('')
  const [clipBoardImage] = useState<OFile>(null)

  async function retrieveImage(data: ClipboardItems) {
    await retrieveImageFromClipboard(data)
  }

  return { clipBoardImageSrc, clipBoardImage, retrieveImage }
}
