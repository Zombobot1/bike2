/// <reference types="react-scripts" />
declare module '*.mp3' {
  const src: string
  export default src
}

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
