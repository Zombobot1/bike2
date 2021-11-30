import { str } from '../../utils/types'
import { UBlockType } from '../editing/types'

type FieldInformationDTO = {
  name: str
  type: UBlockType
}
type FieldInformationDTOs = FieldInformationDTO[]

export interface CardTemplateDTO {
  fields: FieldInformationDTOs
}
