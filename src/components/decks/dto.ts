import { str } from '../../utils/types'
import { UComponentType } from '../ucomponents/types'

type FieldInformationDTO = {
  name: str
  type: UComponentType
}
type FieldInformationDTOs = FieldInformationDTO[]

export interface CardTemplateDTO {
  fields: FieldInformationDTOs
}
