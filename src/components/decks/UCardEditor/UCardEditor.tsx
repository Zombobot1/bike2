import { Box, Button, Stack } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { CardCarousel, CardDatas, CardDataP, CardData } from '../../study/training/training/card-carousel'
import { CardTemplateDTO, getPreviewName } from '../dto'
import { useNewCardData, NewCardData } from './useNewCardData'

interface UCardEditor {
  initialCards?: CardDatas
  template: CardTemplateDTO
  onSubmit: (d: NewCardData) => CardDataP
}

export function UCardEditor({ initialCards = [], onSubmit, template }: UCardEditor) {
  const [cards, setCards] = useState([{ template }, ...initialCards])
  const { submit } = useNewCardData(getPreviewName(template))
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCards.length ? 1 : 0)

  useEffect(() => console.log({ currentCardIndex }), [currentCardIndex])
  useEffect(() => console.log({ cards }), [JSON.stringify(cards)])

  const prev = () => setCurrentCardIndex((i) => i - 1)
  const next = () => setCurrentCardIndex((i) => i + 1)

  const new_ = (createdCard: CardData) => {
    setCards((cs) => [{ template }, createdCard, ...cs.slice(1)])
  }

  const addNew = () => {
    submit((d: NewCardData) => onSubmit(d).then(new_))
  }

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <CardCarousel cards={cards} />
      <Stack direction="row" justifyContent="center">
        {currentCardIndex === 0 && <Button onClick={addNew}>Create</Button>}
        {currentCardIndex > 0 && <Button onClick={prev}>Prev</Button>}
        {currentCardIndex < cards.length - 1 && <Button onClick={next}>Next</Button>}
      </Stack>
    </Box>
  )
}
