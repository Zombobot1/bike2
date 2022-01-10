import { bool } from '../../../utils/types'

export type UListDTOs = UListDTO[]

export class UListDTO {
  id = ''
  unmarked?: bool
  children?: UListDTO[]
}
