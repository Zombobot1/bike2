import { Presentation } from './presentation'
import { SwiperSlide } from 'swiper/react'
import { UCard } from '../../../decks/UCard/UCard'
import { CardDTO, CardEstimation } from '../types'
import { styled } from '@material-ui/core'

export interface CardData {
  dto: CardDTO
  showHidden: boolean
  estimation?: CardEstimation
}
export type CardDatas = CardData[]

export interface CardCarouselP {
  cards: CardDatas
  currentCardIndex: number
}

const Cards = styled('div')({
  width: '100%',
  height: '90%',
  paddingTop: 5,
  paddingBottom: 7,
})

export const CardCarousel = ({ cards, currentCardIndex }: CardCarouselP) => {
  return (
    <Cards>
      <Presentation currentSlide={currentCardIndex}>
        {cards.map((c, i) => (
          <SwiperSlide key={c.dto._id}>
            <UCard
              fields={c.dto.fields}
              stageColor={c.dto.stageColor}
              isCurrent={currentCardIndex === i}
              showHidden={c.showHidden}
              estimation={c.estimation}
            />
          </SwiperSlide>
        ))}
      </Presentation>
    </Cards>
  )
}
