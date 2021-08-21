import { Box, Button, Stack, styled } from '@material-ui/core'
import { FC, useState } from 'react'
import { CardDatas, CardDataP, CardData } from '../../study/training/training/card-carousel'
import { Slides, useSlides } from '../../utils/Slides'
import { CardTemplateDTO } from '../dto'
import { UCardFactory } from './UCardFactory'
import { NewCardData, useSubmitNewCardData } from './useNewCardData'

interface UCardEditor {
  initialCards?: CardDatas
  template: CardTemplateDTO
  onSubmit: (d: NewCardData) => CardDataP
  Factory?: FC<UCardFactory>
}

export function UCardEditor({ initialCards = [], onSubmit, template, Factory = UCardFactory }: UCardEditor) {
  const [_cards, setCards] = useState(initialCards)
  const slides = useSlides(initialCards.length ? 1 : 0)
  const { submit } = useSubmitNewCardData()

  const addCreatedCard = (createdCard: CardData) => setCards((cs) => [createdCard, ...cs])

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <Cards>
        <Slides timeout={500}>
          <Factory key="cards factory" addCreatedCard={addCreatedCard} onSubmit={onSubmit} template={template} />
        </Slides>
      </Cards>
      <Stack direction="row" justifyContent="center">
        {slides.isFirst && <Button onClick={submit}>Create</Button>}
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
