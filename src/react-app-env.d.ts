/// <reference types="node" />
/// <reference types="react-dom" />

// https://stackoverflow.com/questions/61187374/how-to-fix-the-cannot-find-name-clipboarditem-error

interface ClipboardItemOptions {
  presentationStyle?: PresentationStyle
}

interface Clipboard extends EventTarget {
  readText(): Promise<string>
  write(data: ClipboardItems): Promise<void>
  read(): Promise<ClipboardItems>
  writeText(data: string): Promise<void>
}

interface ClipboardItem {
  readonly delayed: boolean
  readonly lastModified: number
  readonly presentationStyle: PresentationStyle

  getType(mime: string): Promise<Blob>
}

declare const ClipboardItem: {
  prototype: ClipboardItem
  new (items: Record<string, ClipboardItemData>, options?: ClipboardItemOptions): ClipboardItem
  createDelayed(items: Record<string, ClipboardItemDelayedCallback>, options?: ClipboardItemOptions): ClipboardItem
}

interface ClipboardItemDelayedCallback {
  (): ClipboardItemData
}

type ClipboardItems = ClipboardItem[]
type ClipboardItemDataType = string | Blob
type ClipboardItemData = Promise<ClipboardItemDataType>

type PresentationStyle = 'attachment' | 'inline' | 'unspecified'

declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>

  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
