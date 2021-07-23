import { bool, str } from '../../../../utils/types'

export type FileOrStr = File | str // empty str === deleted file

export type SetFieldData = (value: FileOrStr) => void

export interface PassiveData {
  name: str
  canBeEdited: bool
  setValue: SetFieldData
  data?: str
  error?: str
}
