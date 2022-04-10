import { str } from '../../../utils/types'
import { UBlockType } from '../../editing/UPage/ublockTypes'

type FieldInformationDTO = {
  name: str
  type: UBlockType
}
type FieldInformationDTOs = FieldInformationDTO[]

export interface CardTemplateDTO {
  fields: FieldInformationDTOs
}
