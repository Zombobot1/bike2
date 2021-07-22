import { UCard } from '../../../decks/UCard/UCard'
import { CardDTO, CardEstimation } from '../types'
import { styled } from '@material-ui/core'
import { CardTemplateDTO } from '../../../decks/dto'
import { Slides } from '../../../utils/Slides'

export interface CardData {
  dto?: CardDTO
  showHidden?: boolean
  estimation?: CardEstimation
  template?: CardTemplateDTO
}
export type CardDatas = CardData[]
export type CardDataP = Promise<CardData>

export interface CardCarouselP {
  cards: CardDatas
}

const Cards = styled('div')({
  width: '100%',
  height: '90%',
  paddingTop: 5,
  paddingBottom: 7,
})

export const CardCarousel = ({ cards }: CardCarouselP) => {
  return (
    <Cards>
      <Slides>
        {cards.map((c, i) => (
          <UCard
            key={c.dto?._id || i}
            fields={c.dto?.fields || []}
            stageColor={c.dto?.stageColor || 'white'}
            showHidden={c.showHidden}
            estimation={c.estimation}
            template={c.template}
          />
        ))}
      </Slides>
    </Cards>
  )
}
