import { useState } from 'react'
import { str, OBlobP, OFile, FileP } from './types'

export function srcfy(blob: Blob): str {
  return URL.createObjectURL(blob)
}

export async function imageFromSrc(src: str): FileP {
  const r = await fetch(src)
  const b = await r.blob()
  return new File([b], 'img.png', { type: 'image/png' })
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
    if (imageBlob) onRead(new File([imageBlob], `img.png`, { type: 'image/png' }))
  }
  // doesn't work in firefox for localhost
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
