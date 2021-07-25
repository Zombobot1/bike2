import { Box } from '@material-ui/core'
import { zip2 } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { str } from '../../../utils/types'
import { uuid } from '../../../utils/utils'
import { CardDataP } from '../../study/training/training/card-carousel'
import { FieldDTOs } from '../../study/training/types'
import { CardTemplateDTO } from '../dto'
import { UCardEditor } from './UCardEditor'
import { NewCardData } from './useNewCardData'

const cardTemplate: CardTemplateDTO = {
  fields: [
    { name: 'phrase', type: 'PRE', isPreview: true },
    { name: 'meaning', type: 'PRE', isPreview: false },
    { name: 'image', type: 'IMG', isPreview: false },
    { name: 'audio', type: 'AUDIO', isPreview: false },
  ],
}

function mockCreate(template: CardTemplateDTO, data: NewCardData): FieldDTOs {
  return zip2(template.fields, data).map(([info, data], i) => {
    const _id = `${i}`
    const passiveData: str = data.value instanceof File ? srcfy(data.value) : data.value
    return { _id, type: info.type, isPreview: info.isPreview, name: info.name, status: 'SHOW', passiveData }
  })
}

const onSubmit = async (data: NewCardData): CardDataP => {
  return {
    dto: {
      _id: uuid(),
      fields: mockCreate(cardTemplate, data),
      stageColor: 'white',
      timeToAnswer: 0,
      type: 'PASSIVE',
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
