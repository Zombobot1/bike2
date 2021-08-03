import { str } from '../../../utils/types'
import { StrBlockComponent } from '../types'

export function fileNameFromFileData(fileData: str): str {
  return fileData
}

// export interface UFile extends StrBlockComponent {}
export function UFile({ data, setData }: StrBlockComponent) {
  setData(data)
}
