import { Box } from '@mui/material'
import { zip2 } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { str } from '../../../utils/types'
import { uuid } from '../../../utils/uuid'
import { CardDataP } from '../../studying/training/training/card-carousel'
import { FieldDTOs } from '../../studying/training/types'
import { CardTemplateDTO } from '../dto'
import { UCardEditor } from './UCardEditor'
import { NewCardData } from './useNewCardData'

const cardTemplate: CardTemplateDTO = {
  fields: [
    { name: 'phrase', type: 'text' },
    { name: 'meaning', type: 'text' },
    { name: 'image', type: 'image' },
    { name: 'audio', type: 'audio' },
  ],
}

function mockCreate(template: CardTemplateDTO, data: NewCardData): FieldDTOs {
  const templateFields = template.fields.filter((f) => data.find((d) => d.name === f.name))
  return zip2(templateFields, data).map(([info, rawData]) => {
    const data: str = rawData.value instanceof File ? srcfy(rawData.value) : rawData.value
    return { _id: uuid(), type: info.type, data }
  })
}

const onSubmit = async (data: NewCardData): CardDataP => {
  return {
    dto: {
      _id: uuid(),
      fields: mockCreate(cardTemplate, data),
      stageColor: 'white',
      timeToAnswer: 0,
    },
  }
}

function Template() {
  return (
    <Box sx={{ maxWidth: '470px', height: '100%' }}>
      <UCardEditor template={cardTemplate} onSubmit={onSubmit} />
    </Box>
  )
}

export const CreatesNewCard = () => <Template />
