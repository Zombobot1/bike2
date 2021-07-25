import { Box, Button, Stack, styled } from '@material-ui/core'
import { useState } from 'react'
import { CardDatas, CardDataP, CardData } from '../../study/training/training/card-carousel'
import { Slides, useSlides } from '../../utils/Slides'
import { CardTemplateDTO, getPreviewName } from '../dto'
import { EditingUCard } from '../UCard/UCard'
import { useNewCardData, NewCardData } from './useNewCardData'

interface UCardEditor {
  initialCards?: CardDatas
  template: CardTemplateDTO
  onSubmit: (d: NewCardData) => CardDataP
}

export function UCardEditor({ initialCards = [], onSubmit, template }: UCardEditor) {
  const [cards, setCards] = useState(initialCards)
  const [createdCount, setCreatedCount] = useState(0)
  const { submit } = useNewCardData(getPreviewName(template))
  const slides = useSlides(initialCards.length ? 1 : 0)

  const new_ = (createdCard: CardData) => {
    setCreatedCount((cc) => cc + 1)
    setCards((cs) => [createdCard, ...cs])
  }

  const addNew = () => {
    submit((d: NewCardData) => onSubmit(d).then(new_))
  }

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <Cards>
        <Slides timeout={500}>
          <EditingUCard key={`cards factory ${createdCount}`} template={template} />
          {cards.map((c) => (
            <EditingUCard key={c.dto._id} fields={c.dto.fields} stageColor={c.dto.stageColor} template={template} />
          ))}
        </Slides>
      </Cards>
      <Stack direction="row" justifyContent="center">
        {slides.isFirst && <Button onClick={addNew}>Create</Button>}
        {!slides.isFirst && <Button onClick={slides.prev}>Prev</Button>}
        {!slides.isLast && <Button onClick={slides.next}>Next</Button>}
      </Stack>
    </Box>
  )
}

const Cards = styled('div')({
  width: '100%',
  height: '90%',
  paddingTop: 5,
  paddingBottom: 7,
})
