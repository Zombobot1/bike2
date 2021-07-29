import { srcfy } from '../../../../utils/filesManipulation'
import { bool, str } from '../../../../utils/types'

export type FileOrStr = File | str // empty str === deleted file

export type SetFieldData = (value: FileOrStr) => void

export interface PassiveData {
  name: str
  canBeEdited: bool
  setNewValue: SetFieldData
  newValue: FileOrStr
  data?: str
  error?: str
}

export function fileToStr(value: FileOrStr): str {
  if (value instanceof File) return srcfy(value as File)
  return value
}
