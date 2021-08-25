import { str } from '../../utils/types'
import { UComponentType } from '../editing/types'

type FieldInformationDTO = {
  name: str
  type: UComponentType
}
type FieldInformationDTOs = FieldInformationDTO[]

export interface CardTemplateDTO {
  fields: FieldInformationDTOs
}
