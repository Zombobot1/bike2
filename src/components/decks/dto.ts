import { str } from '../../utils/types'
import { FieldInformationDTOs } from '../study/training/types'

export interface CardTemplateDTO {
  fields: FieldInformationDTOs
}

export function getPreviewName(template: CardTemplateDTO): str {
  const preview = template.fields.find((f) => f.isPreview)
  if (!preview) throw new Error('Preview not found')
  return preview.name
}
