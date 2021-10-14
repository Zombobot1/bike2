import { useEffect, useState } from 'react'
import { readImageFromKeyboard } from '../../../utils/filesManipulation'
import { Files, OFile, State } from '../../../utils/types'
import { Dropzone, DropzoneB } from './Dropzone'

export interface Drop1zone extends DropzoneB {
  fileS: State<OFile>
}

export function Drop1zone(props: Drop1zone) {
  const [_, setFile] = props.fileS
  const filesS = useState<Files>([])
  useEffect(() => setFile(filesS[0][0]), [JSON.stringify(filesS[0])])
  return <Dropzone filesS={filesS} {...props} label={props.label || 'file'} />
}

export function use1Drop(onDrop: (f: File) => void): State<OFile> {
  const [file, setFile] = useState<OFile>(null)
  useEffect(() => {
    if (file) onDrop(file)
  }, [file])

  return [file, setFile]
}

export function use1ImageDrop(onDrop: (f: File) => void) {
  const fileS = use1Drop(onDrop)
  const readFromKeyboard = readImageFromKeyboard(onDrop)
  return { fileS, readFromKeyboard }
}
